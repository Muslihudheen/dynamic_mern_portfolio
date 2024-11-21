import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Project {
  id: number;
  title: string;
  logo: string;
  image: string;
  category: string;
}

interface PortfolioState {
  projects: Project[];
  activeCategory: string;
  currentLocation: {
    city: string;
    time: string;
    officeHours: string;
  };
}

const initialState: PortfolioState = {
  projects: [
    {
      id: 1,
      title: 'Wikibuy',
      logo: 'W',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      category: 'Web Design'
    },
    {
      id: 2,
      title: 'Fever Free',
      logo: 'F',
      image: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&h=600&fit=crop',
      category: 'iPhone App Design'
    },
    {
      id: 3,
      title: 'Portfolio Book',
      logo: 'P',
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop',
      category: 'Side Projects'
    }
  ],
  activeCategory: 'All',
  currentLocation: {
    city: 'Nashville, TN',
    time: '11:06 PM CST',
    officeHours: 'in office till 6'
  }
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    setActiveCategory: (state, action: PayloadAction<string>) => {
      state.activeCategory = action.payload;
    },
    updateLocation: (state, action: PayloadAction<typeof state.currentLocation>) => {
      state.currentLocation = action.payload;
    }
  }
});

export const { setActiveCategory, updateLocation } = portfolioSlice.actions;
export default portfolioSlice.reducer;