import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import { PropertyForm } from '../components/admin/PropertyForm';
import PropertyList from '../components/admin/PropertyList';
import ActivityForm from '../components/admin/ActivityForm';
import ActivityList from '../components/admin/ActivityList';
import PackageForm from '../components/admin/PackageForm';
import PackageList from '../components/admin/PackageList';
import BlogPostForm from '../components/admin/BlogPostForm';
import BlogPostList from '../components/admin/BlogPostList';
import GuestReviewForm from '../components/admin/GuestReviewForm';
import GuestReviewList from '../components/admin/GuestReviewList';
import OrderList from '../components/admin/OrderList';

const AdminDashboard: React.FC = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-32" />
      <div className="pb-20">
        <Container>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>

          <div className="mb-8">
            <nav className="flex space-x-4">
              <Link
                to="/admin"
                className="text-gray-600 hover:text-amber-600 px-3 py-2 rounded-md"
              >
                Properties
              </Link>
              <Link
                to="/admin/blog"
                className="text-gray-600 hover:text-amber-600 px-3 py-2 rounded-md"
              >
                Blog Posts
              </Link>
              <Link
                to="/admin/reviews"
                className="text-gray-600 hover:text-amber-600 px-3 py-2 rounded-md"
              >
                Guest Reviews
              </Link>
              <Link
                to="/admin/activities"
                className="text-gray-600 hover:text-amber-600 px-3 py-2 rounded-md"
              >
                Activities
              </Link>
              <Link
                to="/admin/packages"
                className="text-gray-600 hover:text-amber-600 px-3 py-2 rounded-md"
              >
                Packages
              </Link>
              <Link
                to="/admin/orders"
                className="text-gray-600 hover:text-amber-600 px-3 py-2 rounded-md"
              >
                Orders
              </Link>
            </nav>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8">
            <Routes>
              <Route index element={<PropertyList />} />
              <Route path="new" element={<PropertyForm />} />
              <Route path="edit/:id" element={<PropertyForm />} />
              <Route path="blog" element={<BlogPostList />} />
              <Route path="blog/new" element={<BlogPostForm />} />
              <Route path="blog/edit/:id" element={<BlogPostForm />} />
              <Route path="reviews" element={<GuestReviewList />} />
              <Route path="reviews/new" element={<GuestReviewForm />} />
              <Route path="activities" element={<ActivityList />} />
              <Route path="activities/new" element={<ActivityForm />} />
              <Route path="activities/edit/:id" element={<ActivityForm />} />
              <Route path="packages" element={<PackageList />} />
              <Route path="packages/new" element={<PackageForm />} />
              <Route path="packages/edit/:id" element={<PackageForm />} />
              <Route path="orders" element={<OrderList />} />
              <Route path="reviews/edit/:id" element={<GuestReviewForm />} />
            </Routes>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default AdminDashboard;