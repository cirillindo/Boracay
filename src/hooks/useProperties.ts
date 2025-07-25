import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Property } from '../types';

interface UsePropertiesOptions {
  forSale?: boolean;
  forRent?: boolean;
  propertyType?: string;
  bedrooms?: string;
  location?: string;
  minPrice?: string;
  maxPrice?: string;
  furnishStatus?: string;
  propertyCategory?: string;
  sortOption?: string;
}

export const useProperties = (options: UsePropertiesOptions = {}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProperties();
  }, [options]);

  const loadProperties = async (resetFilters = false) => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase.from('properties').select('*');
      
      // Apply filters
      if (!resetFilters) {
        if (options.forSale) {
          query = query.eq('is_for_sale', true);
        }
        
        if (options.forRent) {
          query = query.eq('is_for_rent', true);
        }
        
        if (options.propertyType) {
          query = query.eq('property_type', options.propertyType.toLowerCase());
        }
        
        if (options.bedrooms) {
          query = query.eq('bedrooms', parseInt(options.bedrooms));
        }
        
        if (options.location) {
          query = query.eq('location', options.location);
        }
        
        if (options.minPrice) {
          query = query.gte('price', parseInt(options.minPrice));
        }
        
        if (options.maxPrice) {
          query = query.lte('price', parseInt(options.maxPrice));
        }
        
        if (options.furnishStatus) {
          query = query.eq('furnish_status', options.furnishStatus);
        }
        
        if (options.propertyCategory) {
          query = query.eq('property_category', options.propertyCategory);
        }
      }

      // First sort by display_order (nulls last), then apply the user-selected sort option
      query = query.order('display_order', { ascending: true, nullsLast: true });

      // Apply secondary sorting based on user selection
      if (options.sortOption) {
        switch (options.sortOption) {
          case 'latest':
            query = query.order('created_at', { ascending: false });
            break;
          case 'oldest':
            query = query.order('created_at', { ascending: true });
            break;
          case 'highest':
            query = query.order('price', { ascending: false });
            break;
          case 'lowest':
            query = query.order('price', { ascending: true });
            break;
        }
      } else {
        // Default sort by created_at if no sort option specified
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;
      setProperties(data || []);
    } catch (err) {
      console.error('Error loading properties:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    loadProperties(true);
  };

  return { properties, loading, error, loadProperties, resetFilters };
};