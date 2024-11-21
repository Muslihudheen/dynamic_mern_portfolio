import { create } from 'zustand';
import { PROJECT_CATEGORIES } from '../utils/constants';

type Category = (typeof PROJECT_CATEGORIES)[number];

interface ProjectState {
  activeCategory: Category;
  setActiveCategory: (category: Category) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  activeCategory: 'All',
  setActiveCategory: (category) => set({ activeCategory: category }),
}));