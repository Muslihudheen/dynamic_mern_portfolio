import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { aboutAPI } from '../../services/api';
import ImageUpload from '../../components/ImageUpload';

interface TechStackFormData {
  name: string;
  icon: string;
  category: string;
  proficiency: number;
}

const TechStack = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedTech, setSelectedTech] = React.useState<any>(null);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, setValue, watch } = useForm<TechStackFormData>();

  const { data: techStack, isLoading } = useQuery({
    queryKey: ['tech-stack'],
    queryFn: aboutAPI.getTechStack,
  });

  const createMutation = useMutation({
    mutationFn: (data: TechStackFormData) => {
      // Ensure proficiency is a number
      return aboutAPI.createTechStack({
        ...data,
        proficiency: Number(data.proficiency)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tech-stack'] });
      toast.success('Technology added successfully');
      setIsModalOpen(false);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add technology');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: TechStackFormData }) => {
      // Ensure proficiency is a number
      return aboutAPI.updateTechStack(id, {
        ...data,
        proficiency: Number(data.proficiency)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tech-stack'] });
      toast.success('Technology updated successfully');
      setIsModalOpen(false);
      setSelectedTech(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update technology');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: aboutAPI.deleteTechStack,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tech-stack'] });
      toast.success('Technology deleted successfully');
    },
  });

  const handleIconUpload = (url: string) => {
    setValue('icon', url);
  };

  const onSubmit = (data: TechStackFormData) => {
    if (selectedTech) {
      updateMutation.mutate({ id: selectedTech.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const techCategories = React.useMemo(() => {
    if (!techStack) return {};
    return techStack.reduce((acc: any, tech: any) => {
      if (!acc[tech.category]) {
        acc[tech.category] = [];
      }
      acc[tech.category].push(tech);
      return acc;
    }, {});
  }, [techStack]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Tech Stack</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-accent hover:bg-accent/90 text-dark font-medium px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Technology
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-600">Loading...</div>
      ) : (
        <div className="space-y-8">
          {Object.entries(techCategories).map(([category, techs]: [string, any]) => (
            <div key={category}>
              <h2 className="text-xl font-medium mb-4 text-gray-800">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {techs.map((tech: any) => (
                  <div
                    key={tech.id}
                    className="border rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <img src={tech.icon} alt={tech.name} className="w-10 h-10" />
                      <div>
                        <h3 className="font-medium text-gray-800">{tech.name}</h3>
                        <div className="w-32 bg-gray-200 rounded-full h-1.5 mt-2">
                          <div
                            className="bg-accent h-1.5 rounded-full"
                            style={{ width: `${tech.proficiency}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedTech(tech);
                          setIsModalOpen(true);
                          reset(tech); // Pre-fill form with tech data
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this technology?')) {
                            deleteMutation.mutate(tech.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {selectedTech ? 'Edit Technology' : 'Add Technology'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Name</label>
                <input
                  {...register('name')}
                  className="w-full border rounded-lg px-3 py-2 text-gray-800"
                  placeholder="e.g., React"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Category</label>
                <input
                  {...register('category')}
                  placeholder="e.g., Frontend, Backend, Database"
                  className="w-full border rounded-lg px-3 py-2 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Icon</label>
                <ImageUpload onUploadSuccess={handleIconUpload} />
                {watch('icon') && (
                  <img
                    src={watch('icon')}
                    alt="Icon preview"
                    className="mt-2 w-10 h-10"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Proficiency (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  {...register('proficiency')}
                  className="w-full border rounded-lg px-3 py-2 text-gray-800"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedTech(null);
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
                  {selectedTech ? 'Update' : 'Add'} Technology
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechStack;