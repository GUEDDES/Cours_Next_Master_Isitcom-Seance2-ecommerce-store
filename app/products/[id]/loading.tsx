// app/products/[id]/loading.tsx

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb skeleton */}
        <div className="mb-8 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>

        {/* Layout skeleton */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0 animate-pulse">
            {/* Image skeleton */}
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200"></div>

            {/* Content skeleton */}
            <div className="p-8 lg:p-12 space-y-6">
              {/* Badge skeleton */}
              <div className="h-8 bg-gray-200 rounded-full w-1/4"></div>

              {/* Title skeleton */}
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded w-full"></div>
                <div className="h-8 bg-gray-200 rounded w-2/3"></div>
              </div>

              {/* Rating skeleton */}
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>

              {/* Price skeleton */}
              <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/3"></div>

              {/* Description skeleton */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>

              {/* Button skeleton */}
              <div className="h-14 bg-gray-200 rounded-xl w-full"></div>
              <div className="h-14 bg-gray-100 rounded-xl w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
