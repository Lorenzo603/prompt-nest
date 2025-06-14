"use client";

import React, { forwardRef, useImperativeHandle, useState } from "react";
import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";
import {
  InstantSearch,
  SearchBox,
  Hits,
  Configure,
  useInstantSearch,
} from "react-instantsearch";
import PromptHit from "./PromptHit";
import TagFilter from "./TagFilter";

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
    query_by: "text,tags,type",
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

const PromptSearch = forwardRef(({ onPromptUpdated }, ref) => {
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
        indexName="promptnest_prompts"
        searchClient={searchClient}
        future={{ preserveSharedStateOnUnmount: true }}
      >
        <SearchController ref={ref} />
        <div className="mb-4">
          <SearchBox
            placeholder="Search prompts..."
            classNames={{
              input: "px-3 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-gray-50",
            }}
          />
        </div>
        <TagFilter 
          colorTheme="blue"
          placeholder="Filter by tags (comma separated, e.g., portrait, landscape)"
        />
        <Configure hitsPerPage={20} />
        <Hits 
          hitComponent={({ hit }) => (
            <PromptHit hit={hit} onPromptUpdated={onPromptUpdated} />
          )} 
        />
      </InstantSearch>
    </div>
  );
});

PromptSearch.displayName = "PromptSearch";

export default PromptSearch;
