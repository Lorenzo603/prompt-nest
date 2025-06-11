"use client";

import React from "react";
import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";
import {
  InstantSearch,
  SearchBox,
  Hits,
  Configure,
} from "react-instantsearch";
import PromptCard from "./PromptCard";

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

function PromptHit({ hit }) {
  return <PromptCard prompt={hit} />;
}

const PromptSearch = () => {
  return (
    <div className="flex flex-col gap-2 mt-4">
      <InstantSearch
        indexName="prompts"
        searchClient={searchClient}
        future={{ preserveSharedStateOnUnmount: true }}
      >
        <div className="mb-4">
          <SearchBox
            translations={{
              placeholder: "Search prompts...",
            }}
            classNames={{
              input: "px-3 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-gray-50",
            }}
          />
        </div>
        <Configure hitsPerPage={20} />
        <Hits hitComponent={PromptHit} />
      </InstantSearch>
    </div>
  );
};

export default PromptSearch;
