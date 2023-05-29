"use client";
import {usePathname, useRouter} from "next/navigation";
import React, {useMemo} from "react";
import qs from "query-string";
import Button from "@/app/components/Button";
interface EmptyStateProps {
  variant?: string;
  searchNotFound?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({variant, searchNotFound}) => {
  const path = usePathname();
  const router = useRouter();
  const description = useMemo(() => {
    if (searchNotFound && variant) {
      return "Oh no! It seems we couldn't find any results. Keep exploring, you never know what you might find!";
    }
    if (variant === "Favorites") {
      return "Hmm, it seems like you haven't chosen any favorites just yet.";
    } else if (variant === "CompanyOrders") {
      return "Oh, looks like your company hasn't placed any orders yet.";
    } else if (variant === "MyOrders") {
      return "You haven't posted any orders yet. Let's get started!";
    } else {
      return "Choose a chat or start a new conversation. The world is waiting to hear from you!";
    }
  }, [variant, searchNotFound]);
  return (
    <div className="flex items-center justify-center h-full px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center">
        <h3 className="mt-2 text-2xl font-semibold text-dark dark:text-light">{description}</h3>
        <div className="w-48 mt-4">
          {searchNotFound && (
            <Button
              secondary
              onClick={() => {
                const updatedQuery: any = {
                  variant,
                };
                const url = qs.stringifyUrl(
                  {
                    url: "/dashboard/orders",
                    query: updatedQuery,
                  },
                  {skipNull: true}
                );
                router.push(url);
              }}
            >
              Remove all filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
