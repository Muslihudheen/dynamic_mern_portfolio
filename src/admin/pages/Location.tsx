import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { locationAPI } from '../../services/api';

interface LocationFormData {
  city: string;
  officeHours: string;
}

const LocationPage = () => {
  const { register, handleSubmit, reset } = useForm<LocationFormData>();
  const queryClient = useQueryClient();

  const { data: location, isLoading } = useQuery({
    queryKey: ['location'],
    queryFn: locationAPI.get,
    onSuccess: (data) => {
      if (data) {
        reset({
          city: data.city,
          officeHours: data.officeHours,
        });
      }
    },
  });

  const mutation = useMutation({
    mutationFn: locationAPI.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['location'] });
      toast.success('Location updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating location:', error);
      toast.error(error.response?.data?.message || 'Failed to update location');
    },
  });

  const onSubmit = (data: LocationFormData) => {
    mutation.mutate(data);
  };

  if (isLoading) return <div className="text-gray-600">Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Location Settings</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">City</label>
          <input
            {...register('city', { required: 'City is required' })}
            className="w-full border rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400"
            placeholder="e.g., Nashville, TN"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Office Hours</label>
          <input
            {...register('officeHours', { required: 'Office hours are required' })}
            className="w-full border rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400"
            placeholder="e.g., in office till 6"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-accent text-dark font-medium rounded-lg hover:bg-accent/90"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Updating...' : 'Update Location'}
        </button>
      </form>
    </div>
  );
};

export default LocationPage;