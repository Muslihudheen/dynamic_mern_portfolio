import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { aboutAPI } from '../../services/api';
import { getMaxDate, validateDateRange } from '../../utils/validation';

interface ExperienceFormData {
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

const Experience = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedExperience, setSelectedExperience] = React.useState<any>(null);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, watch, formState: { errors }, trigger } = useForm<ExperienceFormData>();
  const isCurrent = watch('current');
  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const maxDate = getMaxDate();

  React.useEffect(() => {
    if (startDate && endDate) {
      trigger('endDate'); // Re-validate end date when start date changes
    }
  }, [startDate, trigger]);

  const { data: experiences, isLoading } = useQuery({
    queryKey: ['experiences'],
    queryFn: aboutAPI.getExperiences,
  });

  const createMutation = useMutation({
    mutationFn: aboutAPI.createExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      toast.success('Experience added successfully');
      setIsModalOpen(false);
      reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ExperienceFormData }) =>
      aboutAPI.updateExperience(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      toast.success('Experience updated successfully');
      setIsModalOpen(false);
      setSelectedExperience(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: aboutAPI.deleteExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      toast.success('Experience deleted successfully');
    },
  });

  const onSubmit = (data: ExperienceFormData) => {
    if (selectedExperience) {
      updateMutation.mutate({ id: selectedExperience.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Work Experience</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-accent hover:bg-accent/90 text-dark font-medium px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-600">Loading...</div>
      ) : (
        <div className="space-y-4">
          {experiences?.map((experience: any) => (
            <div
              key={experience.id}
              className="border rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-800">{experience.title}</h3>
                  <p className="text-gray-600">{experience.company}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(experience.startDate).toLocaleDateString()} -{' '}
                    {experience.current ? 'Present' : new Date(experience.endDate).toLocaleDateString()}
                  </p>
                  <p className="mt-2 text-gray-700">{experience.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedExperience(experience);
                      setIsModalOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this experience?')) {
                        deleteMutation.mutate(experience.id);
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
              {selectedExperience ? 'Edit Experience' : 'Add Experience'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Title</label>
                <input
                  {...register('title', { required: 'Title is required' })}
                  defaultValue={selectedExperience?.title}
                  className="w-full border rounded-lg px-3 py-2 text-gray-800"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Company</label>
                <input
                  {...register('company', { required: 'Company is required' })}
                  defaultValue={selectedExperience?.company}
                  className="w-full border rounded-lg px-3 py-2 text-gray-800"
                />
                {errors.company && (
                  <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Start Date</label>
                <input
                  type="date"
                  max={maxDate}
                  {...register('startDate', { 
                    required: 'Start date is required',
                    max: {
                      value: maxDate,
                      message: 'Start date cannot be in the future'
                    }
                  })}
                  defaultValue={selectedExperience?.startDate?.split('T')[0]}
                  className="w-full border rounded-lg px-3 py-2 text-gray-800"
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register('current')}
                    defaultChecked={selectedExperience?.current}
                  />
                  <span className="text-sm text-gray-700">Current Position</span>
                </label>
              </div>

              {!isCurrent && (
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">End Date</label>
                  <input
                    type="date"
                    max={maxDate}
                    {...register('endDate', {
                      required: !isCurrent ? 'End date is required' : false,
                      max: {
                        value: maxDate,
                        message: 'End date cannot be in the future'
                      },
                      validate: {
                        validRange: (value) => 
                          !value || validateDateRange(startDate, value) || 
                          'End date must be after start date'
                      }
                    })}
                    defaultValue={selectedExperience?.endDate?.split('T')[0]}
                    className="w-full border rounded-lg px-3 py-2 text-gray-800"
                  />
                  {errors.endDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
                <textarea
                  {...register('description', { required: 'Description is required' })}
                  defaultValue={selectedExperience?.description}
                  rows={4}
                  className="w-full border rounded-lg px-3 py-2 text-gray-800"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedExperience(null);
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
                  {selectedExperience ? 'Update' : 'Add'} Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Experience;