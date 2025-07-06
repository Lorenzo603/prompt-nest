"use client";

import React, { forwardRef, useImperativeHandle } from "react";
import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";
import {
  InstantSearch,
  Hits,
  Configure,
  useInstantSearch,
  Pagination,
} from "react-instantsearch";
import CheckpointHit from "../CheckpointHit";
import TagFilter from "../TagFilter";
import CustomSearchBox from "./CustomSearchBox";
import ResultsCount from "./ResultsCount";

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY || "xyz", // search-only key
    nodes: [
      {
        host: process.env.NEXT_PUBLIC_TYPESENSE_HOST || "localhost",
        port: process.env.NEXT_PUBLIC_TYPESENSE_PORT
          ? Number(process.env.NEXT_PUBLIC_TYPESENSE_PORT)
          : 8108,
        path: process.env.NEXT_PUBLIC_TYPESENSE_PATH || '',
        protocol: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL || "http",

      },
    ],
  },
  additionalSearchParameters: {
    query_by: "name,tags,description",
    sort_by: "creationDate:desc",
  },
});

const searchClient = typesenseInstantsearchAdapter.searchClient;

// Component that uses the useInstantSearch hook to access refresh method
const SearchController = forwardRef((props, ref) => {
  const { refresh } = useInstantSearch();
  
  useImperativeHandle(ref, () => ({
    refresh: refresh
  }));
  
  return null; // This component doesn't render anything
});

SearchController.displayName = "SearchController";

const CheckpointSearch = forwardRef(({ onCheckpointUpdated }, ref) => {
  return (
    <div className="flex flex-col gap-2 mt-4">
      <style jsx global>{`
        .ais-Highlight-highlighted {
          background-color: #fef08a !important;
          padding: 1px 2px;
          border-radius: 2px;
          font-weight: 600;
        }
      `}</style>
      <InstantSearch
        indexName="promptnest_checkpoints"
        searchClient={searchClient}
        future={{ preserveSharedStateOnUnmount: true }}
      >
        <SearchController ref={ref} />
        <div className="mb-4 bg-gray-400 p-4 rounded shadow">
          <CustomSearchBox 
            placeholder="Search checkpoints/models..."
            colorTheme="green"
          />
          <TagFilter 
            colorTheme="green"
            placeholder="Filter by tags (comma separated, e.g., realistic, style)"
          />
        </div>
        
        <ResultsCount colorTheme="green" />
        
        <Configure hitsPerPage={20} />
        <Hits 
          hitComponent={(props) => (
            <CheckpointHit {...props} onCheckpointUpdated={onCheckpointUpdated} />
          )} 
        />
        
        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <Pagination 
            className="flex items-center gap-2"
            classNames={{
              list: "flex items-center gap-1",
              item: "min-w-[40px] h-10 flex items-center justify-center rounded-md border border-green-200 bg-white text-green-700 hover:bg-green-100 transition-colors cursor-pointer text-sm font-medium",
              selectedItem: "!bg-green-600 !text-white !border-green-600 hover:!bg-green-700",
              disabledItem: "opacity-50 cursor-not-allowed hover:bg-white",
              link: "w-full h-full flex items-center justify-center px-3",
              previousPageItem: "rounded-l-md",
              nextPageItem: "rounded-r-md",
            }}
            showFirst={true}
            showLast={true}
            showPrevious={true}
            showNext={true}
            padding={2}
          />
        </div>
      </InstantSearch>
    </div>
  );
});

CheckpointSearch.displayName = "CheckpointSearch";

export default CheckpointSearch;
