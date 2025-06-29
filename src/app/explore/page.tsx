'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ClientOnly from '@/src/components/ClientOnly';
import Footer from '@/src/components/Footer';
import Newsletter from '@/src/components/Newsletter';
import { MagnifyingGlassIcon, MapIcon, CalendarIcon, TagIcon, UsersIcon, SparklesIcon, RocketLaunchIcon, MapPinIcon, FunnelIcon, StarIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';

interface ExploreOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
  bgImage?: string;
}

const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const exploreOptions: ExploreOption[] = [
    {
      id: 'search',
      title: 'Search Itineraries',
      description: 'Find the perfect trip by destination, dates, or activities',
      icon: MagnifyingGlassIcon,
      href: '/itineraries',
      color: 'from-blue-600/20 to-blue-800/20',
      bgImage: '/images/search-bg.jpg'
    },
    {
      id: 'map',
      title: 'Explore by Map',
      description: 'Coming Soon: Discover destinations visually on an interactive map',
      icon: MapIcon,
      href: '/itineraries',
      color: 'from-green-600/20 to-green-800/20',
      bgImage: '/images/map-bg.jpg'
    },
    {
      id: 'dates',
      title: 'Browse by Dates',
      description: 'Coming Soon: Find trips that fit your perfect travel schedule',
      icon: CalendarIcon,
      href: '/itineraries',
      color: 'from-purple-600/20 to-purple-800/20',
      bgImage: '/images/calendar-bg.jpg'
    },
    {
      id: 'themes',
      title: 'Explore by Theme',
      description: 'Coming Soon: Adventure, relaxation, culture, and more curated themes',
      icon: TagIcon,
      href: '/itineraries',
      color: 'from-orange-600/20 to-orange-800/20',
      bgImage: '/images/themes-bg.jpg'
    },
    {
      id: 'group',
      title: 'Group Travel',
      description: 'Coming Soon: Perfect trips tailored for solo, couples, families & groups',
      icon: UsersIcon,
      href: '/itineraries',
      color: 'from-pink-600/20 to-pink-800/20',
      bgImage: '/images/group-bg.jpg'
    },
    {
      id: 'featured',
      title: 'Featured Collections',
      description: 'Coming Soon: Hand-picked experiences by our travel experts',
      icon: SparklesIcon,
      href: '/itineraries',
      color: 'from-yellow-600/20 to-yellow-800/20',
      bgImage: '/images/featured-bg.jpg'
    }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-b from-[#080E14] to-[#0A1018]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-yellow-400/20 backdrop-blur-sm border border-yellow-400/30 text-yellow-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <RocketLaunchIcon className="w-4 h-4 mr-2" />
            Coming Soon - Preview
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Explore Your Next Adventure
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Get a sneak peek at new ways to discover incredible journeys
          </p>
        </div>

        {/* Quick Search Bar Preview */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="relative opacity-60 cursor-not-allowed">
            <input
              type="text"
              value="Search destinations, activities, or themes..."
              readOnly
              disabled
              className="w-full px-6 py-4 pl-14 bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-full text-gray-400 placeholder-gray-400 cursor-not-allowed"
            />
            <MagnifyingGlassIcon className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500" />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700/50 text-gray-400 px-6 py-2 rounded-full font-medium flex items-center gap-2 cursor-not-allowed">
              Search
              <ArrowRightIcon className="w-4 h-4" />
            </div>
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-400 px-3 py-1 rounded-full text-xs font-medium">
              Preview Only
            </div>
          </div>
        </div>

        {/* Explore Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {exploreOptions.map((option) => {
            const Icon = option.icon;
            const isComingSoon = option.description.startsWith('Coming Soon:');
            const isClickable = option.id === 'search';
            
            if (isClickable) {
              return (
                <Link
                  key={option.id}
                  href={option.href}
                  className="group relative overflow-hidden rounded-2xl bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 hover:border-yellow-400/50 hover:bg-gray-900/70 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-30`}></div>
                  <div className="relative p-8">
                    <Icon className="w-12 h-12 text-white mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">{option.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{option.description}</p>
                    <div className="flex items-center text-yellow-400 font-medium">
                      <span>Explore</span>
                      <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            }

            return (
              <div
                key={option.id}
                className="relative overflow-hidden rounded-2xl bg-gray-900/30 backdrop-blur-sm border border-gray-800/30 opacity-60 cursor-not-allowed"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-20`}></div>
                <div className="absolute top-4 right-4 bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 text-blue-400 px-3 py-1 rounded-full text-xs font-medium z-10">
                  Coming Soon
                </div>
                <div className="relative p-8">
                  <Icon className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-bold text-gray-300 mb-2">{option.title}</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    {option.description.replace('Coming Soon: ', '')}
                  </p>
                  <div className="flex items-center text-gray-500 font-medium">
                    <span>Preview Only</span>
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>


        {/* What's Coming */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800/50">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <RocketLaunchIcon className="w-8 h-8 text-yellow-400 mr-3" />
              <h3 className="text-2xl font-bold text-white">What's Coming Next</h3>
            </div>
            <p className="text-gray-400 mb-6">
              We're building exciting new ways to discover your perfect trip. Here's what's in development:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                <div className="flex items-center mb-2">
                  <MapPinIcon className="w-5 h-5 text-red-400 mr-2" />
                  <h4 className="text-red-400 font-medium">Interactive Map</h4>
                </div>
                <p className="text-gray-400 text-sm">Explore destinations visually and discover nearby experiences</p>
              </div>
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                <div className="flex items-center mb-2">
                  <FunnelIcon className="w-5 h-5 text-blue-400 mr-2" />
                  <h4 className="text-blue-400 font-medium">Smart Filters</h4>
                </div>
                <p className="text-gray-400 text-sm">Find trips by theme, group size, and travel dates</p>
              </div>
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                <div className="flex items-center mb-2">
                  <StarIcon className="w-5 h-5 text-yellow-400 mr-2" />
                  <h4 className="text-yellow-400 font-medium">Curated Collections</h4>
                </div>
                <p className="text-gray-400 text-sm">Expert-picked experiences and trending destinations</p>
              </div>
            </div>
            <div className="mt-6">
              <Link 
                href="/itineraries"
                className="inline-flex items-center bg-yellow-400 text-black px-6 py-3 rounded-full font-medium hover:bg-yellow-400/90 transition-colors"
              >
                Browse Current Trips
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Newsletter />
      <Footer />
    </div>
  );
};

export default function Explore() {
  return (
    <ClientOnly>
      <ExplorePage />
    </ClientOnly>
  );
}