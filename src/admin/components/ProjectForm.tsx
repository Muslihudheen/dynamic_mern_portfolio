import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Editor } from '@tinymce/tinymce-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { categoryAPI, skillsAPI } from '../../services/api';
import ImageUpload from '../../components/ImageUpload';
import type { Category, Project, ProjectFormData, Skill } from '../../utils/types';

interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: ProjectFormData) => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSubmit, onCancel }) => {
  const [newSkill, setNewSkill] = React.useState('');
  const queryClient = useQueryClient();
  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<ProjectFormData>({
    defaultValues: project ? {
      ...project,
      skills: project.skills.map(s => s.id)
    } : {
      title: '',
      description: '',
      logo: '',
      image: '',
      categoryId: undefined,
      skills: []
    }
  });

  const selectedSkills = watch('skills') || [];

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryAPI.getAll
  });

  const { data: skills } = useQuery({
    queryKey: ['skills'],
    queryFn: skillsAPI.getAll
  });

  const createSkillMutation = useMutation({
    mutationFn: skillsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      setNewSkill('');
    }
  });

  const handleImageUpload = (url: string) => {
    setValue('image', url);
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
    if (!newSkill.trim()) return;
    
    try {
      await createSkillMutation.mutateAsync({ name: newSkill.trim() });
    } catch (error) {
      console.error('Failed to create skill:', error);
    }
  };

  const toggleSkill = (skillId: number) => {
    const currentSkills = selectedSkills;
    const newSkills = currentSkills.includes(skillId)
      ? currentSkills.filter(id => id !== skillId)
      : [...currentSkills, skillId];
    setValue('skills', newSkills);
  };

  const handleFormSubmit = (data: ProjectFormData) => {
    const formattedData = {
      ...data,
      categoryId: Number(data.categoryId),
      skills: data.skills || [],
      description: data.description || '',
    };
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Title</label>
        <input
          {...register('title', { required: 'Title is required' })}
          className="w-full border rounded-lg px-3 py-2 text-gray-800"
          placeholder="Project title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Category</label>
        <select
          {...register('categoryId', { required: 'Category is required' })}
          className="w-full border rounded-lg px-3 py-2 text-gray-800"
        >
          <option value="">Select category</option>
          {categories?.map((category: Category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Logo Text</label>
        <input
          {...register('logo', { required: 'Logo is required', maxLength: 2 })}
          className="w-full border rounded-lg px-3 py-2 text-gray-800"
          placeholder="1-2 characters"
        />
        {errors.logo && (
          <p className="mt-1 text-sm text-red-600">{errors.logo.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
        <Controller
          name="description"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              init={{
                height: 400,
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
              value={value}
              onEditorChange={onChange}
            />
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Project Image</label>
        <ImageUpload onUploadSuccess={handleImageUpload} />
        {watch('image') && (
          <img 
            src={watch('image')} 
            alt="Project preview" 
            className="mt-2 h-32 rounded-lg object-cover"
          />
        )}
        {errors.image && (
          <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Skills</label>
        <div className="mb-2 flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2 text-gray-800"
            placeholder="Add new skill"
          />
          <button
            type="button" // Change to type="button" to prevent form submission
            onClick={handleAddSkill}
            className="px-4 py-2 bg-accent text-dark rounded-lg hover:bg-accent/90 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {skills?.map((skill: Skill) => (
            <label
              key={skill.id}
              className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selectedSkills.includes(skill.id)}
                onChange={() => toggleSkill(skill.id)}
                className="rounded text-accent focus:ring-accent"
              />
              <span className="text-gray-700">{skill.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-accent text-dark font-medium rounded-lg hover:bg-accent/90"
        >
          {project ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;