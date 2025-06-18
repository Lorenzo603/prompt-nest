"use client";

import React, { forwardRef, useImperativeHandle } from "react";
import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";
import {
  InstantSearch,
  Hits,
  Configure,
  useInstantSearch,
  useStats,
} from "react-instantsearch";
import CheckpointHit from "../CheckpointHit";
import TagFilter from "../TagFilter";
import CustomSearchBox from "./CustomSearchBox";

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

// Component to display search results count
const ResultsCount = () => {
  const { nbHits, processingTimeMS, query } = useStats();
  
  return (
    <div className="flex items-center justify-between text-sm text-gray-200 mb-4">
      <div>
        {nbHits > 0 ? (
          <>
            <span className="font-medium text-green-400">{nbHits.toLocaleString()}</span>
            <span> result{nbHits !== 1 ? 's' : ''}</span>
            {query && (
              <>
                <span> for </span>
                <span className="font-medium">"{query}"</span>
              </>
            )}
          </>
        ) : (
          <span>No results found{query && ` for "${query}"`}</span>
        )}
      </div>
      <div className="text-gray-500">
        {processingTimeMS}ms
      </div>
    </div>
  );
};

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
        
        <ResultsCount />
        
        <Configure hitsPerPage={20} />
        <Hits 
          hitComponent={(props) => (
            <CheckpointHit {...props} onCheckpointUpdated={onCheckpointUpdated} />
          )} 
        />
      </InstantSearch>
    </div>
  );
});

CheckpointSearch.displayName = "CheckpointSearch";

export default CheckpointSearch;
