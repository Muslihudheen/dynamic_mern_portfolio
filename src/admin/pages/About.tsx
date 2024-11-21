import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Editor } from '@tinymce/tinymce-react';
import toast from 'react-hot-toast';
import { aboutAPI } from '../../services/api';
import { API_BASE_URL } from '../../utils/constants';
import { Upload } from 'lucide-react';

const AboutPage = () => {
  const queryClient = useQueryClient();
  const { data: about } = useQuery({
    queryKey: ['about'],
    queryFn: aboutAPI.get,
  });

  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: about || {
      biography: '',
      resumeUrl: '',
    },
  });

  const mutation = useMutation({
    mutationFn: aboutAPI.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about'] });
      toast.success('About information updated successfully');
    },
    onError: () => {
      toast.error('Failed to update about information');
    },
  });

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      // Get token from localStorage
      const authStorage = localStorage.getItem('auth-storage');
      const token = authStorage ? JSON.parse(authStorage)?.state?.token : null;

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/upload/resume`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setValue('resumeUrl', data.url);
      toast.success('Resume uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload resume');
      console.error('Upload error:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">About Me</h1>
      
      <form onSubmit={handleSubmit(mutation.mutate)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Biography</label>
          <Editor
            apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
            init={{
              height: 500,
              menubar: false,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
              ],
              toolbar: 'undo redo | blocks | ' +
                'bold italic forecolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
            value={watch('biography')}
            onEditorChange={(content) => setValue('biography', content)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Resume (PDF)</label>
          <div className="relative">
            <input
              type="file"
              accept=".pdf"
              onChange={handleResumeUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Click or drag to upload PDF resume
              </p>
            </div>
          </div>
          {watch('resumeUrl') && (
            <div className="mt-2">
              <a
                href={watch('resumeUrl')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center gap-1"
              >
                View current resume
              </a>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-accent text-dark font-medium rounded-lg hover:bg-accent/90"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default AboutPage;