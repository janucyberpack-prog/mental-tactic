import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white/80 rounded-3xl p-6 border border-[#EBE6DC] shadow-sm animate-pulse flex flex-col justify-between h-[420px]">
      <div>
        <div className="w-full h-52 bg-[#EAE5DB] rounded-2xl mb-5" />
        <div className="h-4 w-24 bg-[#EAE5DB] rounded-full mb-3" />
        <div className="h-6 w-5/6 bg-[#EAE5DB] rounded-lg mb-2" />
        <div className="h-4 w-full bg-[#EAE5DB] rounded-lg mb-1" />
        <div className="h-4 w-4/6 bg-[#EAE5DB] rounded-lg" />
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-[#F2ECE4]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#EAE5DB]" />
          <div className="h-3 w-20 bg-[#EAE5DB] rounded" />
        </div>
        <div className="h-3 w-12 bg-[#EAE5DB] rounded" />
      </div>
    </div>
  );
};

export const ArticleSkeleton: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 animate-pulse">
      <div className="h-4 w-28 bg-[#EAE5DB] rounded-full mx-auto mb-6" />
      <div className="h-10 w-4/5 bg-[#EAE5DB] rounded-xl mx-auto mb-4" />
      <div className="h-5 w-3/5 bg-[#EAE5DB] rounded-lg mx-auto mb-8" />
      <div className="h-96 w-full bg-[#EAE5DB] rounded-3xl mb-12" />
      <div className="space-y-4">
        <div className="h-4 w-full bg-[#EAE5DB] rounded" />
        <div className="h-4 w-full bg-[#EAE5DB] rounded" />
        <div className="h-4 w-5/6 bg-[#EAE5DB] rounded" />
        <div className="h-4 w-4/6 bg-[#EAE5DB] rounded" />
      </div>
    </div>
  );
};

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto px-6 py-12 animate-pulse">
      <div className="w-24 h-24 rounded-full bg-[#EAE5DB] mx-auto mb-6" />
      <div className="h-7 w-40 bg-[#EAE5DB] rounded-lg mx-auto mb-3" />
      <div className="h-4 w-56 bg-[#EAE5DB] rounded mx-auto mb-8" />
      <div className="bg-white rounded-3xl p-6 border border-[#EBE6DC] space-y-4">
        <div className="h-12 bg-[#EAE5DB] rounded-2xl" />
        <div className="h-24 bg-[#EAE5DB] rounded-2xl" />
      </div>
    </div>
  );
};
