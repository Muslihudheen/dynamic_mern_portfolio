import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { aboutAPI } from '../../services/api';

interface EducationFormData {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

const Education = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedEducation, setSelectedEducation] = React.useState<any>(null);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, watch } = useForm<EducationFormData>();
  const isCurrent = watch('current');

  const { data: education, isLoading } = useQuery({
    queryKey: ['education'],
    queryFn: aboutAPI.getEducation,
  });

  const createMutation = useMutation({
    mutationFn: aboutAPI.createEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] });
      toast.success('Education added successfully');
      setIsModalOpen(false);
      reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: EducationFormData }) =>
      aboutAPI.updateEducation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] });
      toast.success('Education updated successfully');
      setIsModalOpen(false);
      setSelectedEducation(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: aboutAPI.deleteEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] });
      toast.success('Education deleted successfully');
    },
  });

  const onSubmit = (data: EducationFormData) => {
    if (selectedEducation) {
      updateMutation.mutate({ id: selectedEducation.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Education</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-accent hover:bg-accent/90 text-dark font-medium px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Education
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-600">Loading...</div>
      ) : (
        <div className="space-y-4">
          {education?.map((edu: any) => (
            <div
              key={edu.id}
              className="border rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-800">{edu.degree}</h3>
                  <p className="text-gray-600">{edu.institution}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(edu.startDate).toLocaleDateString()} -{' '}
                    {edu.current ? 'Present' : new Date(edu.endDate).toLocaleDateString()}
                  </p>
                  {edu.description && (
                    <p className="mt-2 text-gray-700">{edu.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedEducation(edu);
                      setIsModalOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this education?')) {
                        deleteMutation.mutate(edu.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {selectedEducation ? 'Edit Education' : 'Add Education'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Institution</label>
                <input
                  {...register('institution')}
                  defaultValue={selectedEducation?.institution}
                  className="w-full border rounded-lg px-3 py-2 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Degree</label>
                <input
                  {...register('degree')}
                  defaultValue={selectedEducation?.degree}
                  className="w-full border rounded-lg px-3 py-2 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Field of Study</label>
                <input
                  {...register('field')}
                  defaultValue={selectedEducation?.field}
                  className="w-full border rounded-lg px-3 py-2 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Start Date</label>
                <input
                  type="date"
                  {...register('startDate')}
                  defaultValue={selectedEducation?.startDate?.split('T')[0]}
                  className="w-full border rounded-lg px-3 py-2 text-gray-800"
                />
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register('current')}
                    defaultChecked={selectedEducation?.current}
                  />
                  <span className="text-sm text-gray-700">Current Student</span>
                </label>
              </div>
              {!isCurrent && (
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">End Date</label>
                  <input
                    type="date"
                    {...register('endDate')}
                    defaultValue={selectedEducation?.endDate?.split('T')[0]}
                    className="w-full border rounded-lg px-3 py-2 text-gray-800"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
                <textarea
                  {...register('description')}
                  defaultValue={selectedEducation?.description}
                  rows={4}
                  className="w-full border rounded-lg px-3 py-2 text-gray-800"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedEducation(null);
                    reset();
                  }}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-accent text-dark rounded-lg hover:bg-accent/90 font-medium"
                >
                  {selectedEducation ? 'Update' : 'Add'} Education
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Education;