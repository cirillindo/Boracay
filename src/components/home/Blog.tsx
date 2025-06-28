import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Container from '../ui/Container';
import Button from '../ui/Button';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getCategorySlug } from '../../utils/slugify';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  image_url: string;
  created_at: string;
  slug: string;
  seo_description?: string;
  author?: {
    name: string;
    avatar?: string;
  };
}

interface GuidePost {
  title: string;
  image_url: string;
  created_at: string;
  slug: string;
  category: string;
}

const Blog: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [popularPosts, setPopularPosts] = useState<BlogPost[]>([]);
  const [guidePosts, setGuidePosts] = useState<GuidePost[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    loadPosts();
    loadGuidePosts();
  }, []);

  useEffect(() => {
    if (!scrollRef.current || popularPosts.length === 0) return;

    const scrollHeight = scrollRef.current.scrollHeight / 3;
    let animationFrameId: number;
    let lastTime = performance.now();
    const scrollSpeed = 0.02;

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      setScrollPosition(prev => {
        let newPosition = prev + scrollSpeed * deltaTime;
        if (newPosition >= scrollHeight) {
          newPosition = 0;
        }
        return newPosition;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [popularPosts]);

  const loadPosts = async () => {
    try {
      const { data: featuredData } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (featuredData) {
        setFeaturedPost(featuredData);
      }

      const { data: popularData } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .range(1, 8);

      if (popularData) {
        setPopularPosts([...popularData, ...popularData, ...popularData]);
      }
    } catch (error) {
      console.error('Error loading blog posts:', error);
    }
  };

  const loadGuidePosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('title, image_url, created_at, slug, category')
        .eq('published', true)
        .eq('category', "BORACAY'S GUIDE")
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGuidePosts(data || []);
    } catch (err) {
      console.error('Error loading guide posts:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section 
      ref={sectionRef}
      className="relative bg-white pb-4"
      style={{ 
        backgroundImage: 'url(https://res.cloudinary.com/dq3fftsfa/image/upload/v1748373995/properties/qjkkbr7dmxpl1bmfx4bv.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-white/90" />
      
      <Container className="relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            EXCEPTIONAL BLOG FOR BORACAY
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            How to Buy Property in Boracay (Without Regret)<br />
            Airbnb ROI in Boracay: Real Numbers<br />
            Why "Near the Beach" Is Better than Beachfront<br />
            <Link to="/blog" className="text-amber-600 hover:text-amber-700">📍 Read More</Link>
          </p>
          <div className="w-24 h-1 bg-primary mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {featuredPost && (
            <div 
              className="lg:col-span-2 transform transition-all duration-1000"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateX(0)' : 'translateX(-40px)'
              }}
            >
              <Link to={`/blog/${getCategorySlug(featuredPost.category)}/${featuredPost.slug}`} className="block">
                <div className="relative rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm shadow-xl hover:-rotate-1 hover:scale-[1.01] transition-all duration-500">
                  <img 
                    src={featuredPost.image_url}
                    alt={featuredPost.title}
                    className="w-full h-[600px] object-cover transform transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-8 bg-white/95 backdrop-blur-sm rounded-t-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-primary font-medium uppercase tracking-wider">
                        {featuredPost.category}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(featuredPost.created_at)}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 hover:text-primary transition-colors">
                      {featuredPost.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {featuredPost.excerpt}
                    </p>
                    <Button 
                      variant="outline"
                      className="text-sm"
                    >
                      Blog insights →
                    </Button>
                  </div>
                </div>
              </Link>
            </div>
          )}

          <div 
            className="lg:col-span-1 transform transition-all duration-1000"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(40px)'
            }}
          >
            <div 
              ref={scrollRef}
              className="h-[600px] overflow-hidden"
            >
              <div 
                className="space-y-6"
                style={{
                  transform: `translateY(-${scrollPosition}px)`,
                  transition: 'transform 0.1s linear'
                }}
              >
                {popularPosts.map((post, index) => (
                  <Link
                    key={`${post.id}-${index}`}
                    to={`/blog/${getCategorySlug(post.category)}/${post.slug}`}
                    className="block group"
                  >
                    <div className="flex gap-4 bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow hover:shadow-lg hover:-rotate-1 hover:scale-[1.02] transition-all duration-500">
                      <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <div className="flex-1">
                        <span className="text-xs text-primary font-medium">
                          {post.category}
                        </span>
                        <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 text-sm mb-1">
                          {post.title}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatDate(post.created_at)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Blog;