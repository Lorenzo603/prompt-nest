import typesense
import json
import os
from dotenv import load_dotenv


class TypesenseManager:
    def __init__(self, api_key=None, host='localhost', port='8108', protocol='http'):
        load_dotenv()
        if api_key is None:
            api_key = os.getenv('TYPESENSE_ADMIN_API_KEY', '')
        self.client = typesense.Client({
            'api_key': api_key,
            'nodes': [{
                'host': host,
                'port': port,
                'protocol': protocol
            }],
            'connection_timeout_seconds': 2
        })

    def create_collection_prompts(self):
        create_response = self.client.collections.create({
            'name': 'promptnest_prompts',
            'fields': [
                {'name': 'id', 'type': 'string'},
                {'name': 'text', 'type': 'string'},
                {'name': 'creationDate', 'type': 'string', 'sort': True},
                {'name': 'type', 'type': 'string'},
                {'name': 'tags', 'type': 'string[]'},
            ],
            'default_sorting_field': 'creationDate',
        })
        print("Collection creation response:", create_response)
        return create_response
    
    def create_collection_checkpoints(self):
        create_response = self.client.collections.create({
            'name': 'promptnest_checkpoints',
            'fields': [
                {'name': 'id', 'type': 'string'},
                {'name': 'name', 'type': 'string'},
                {'name': 'description', 'type': 'string'},
                {'name': 'creationDate', 'type': 'string', 'sort': True},
                {'name': 'filename', 'type': 'string'},
                {'name': 'urls', 'type': 'string[]'},
                {'name': 'settings', 'type': 'string'},
                {'name': 'baseModel', 'type': 'string'},
                {'name': 'relatedModels', 'type': 'string[]'},
                {'name': 'tags', 'type': 'string[]'},
            ],
            'default_sorting_field': 'creationDate',
        })
        print("Collection creation response:", create_response)
        return create_response
    
    def create_collection_loras(self):
        create_response = self.client.collections.create({
            'name': 'promptnest_loras',
            'fields': [
                {'name': 'id', 'type': 'string'},
                {'name': 'name', 'type': 'string'},
                {'name': 'description', 'type': 'string'},
                {'name': 'creationDate', 'type': 'string', 'sort': True},
                {'name': 'filename', 'type': 'string'},
                {'name': 'triggerWords', 'type': 'string[]'},
                {'name': 'urls', 'type': 'string[]'},
                {'name': 'settings', 'type': 'string'},
                {'name': 'baseModel', 'type': 'string'},
                {'name': 'tags', 'type': 'string[]'},
            ],
            'default_sorting_field': 'creationDate',
        })
        print("Collection creation response:", create_response)
        return create_response
    
    def update_collection(self, collection_name):
        update_response = self.client.collections[collection_name].update({
            'fields': [
                {
                'name'  :  'uploadDate',
                'drop'  :  True
                },
                # {'name': 'hash', 'type': 'string',  'optional': True},
                {'name': 'publishedDate', 'type': 'string', 'sort': True,  'optional': True},
            ],
        })
        print("Collection update response:", update_response)
        return update_response

    def delete_collection(self, collection_name):
        delete_response = self.client.collections[collection_name].delete()
        print("Collection deletion response:", delete_response)
        return delete_response

    def search_documents(self, collection_name, query='', query_by='*', filter_by=None, sort_by='creationDate:desc', page=1, per_page=10):
        search_parameters = {
            'q': query,
            'query_by': query_by,
            'sort_by': sort_by,
            'page': page,
            'per_page': per_page
        }
        if filter_by:
            search_parameters['filter_by'] = filter_by

        search_response = self.client.collections[collection_name].documents.search(search_parameters)
        print("Search response:", json.dumps(search_response, indent=2))
        return search_response

    def create_api_key(self):
        create_key_response = self.client.keys.create({
            'description': 'Search-only PromptNest key.',
            'actions': ['documents:search'],
            'collections': ['promptnest_.*'],
        })
        print("API Key creation response:", create_key_response)
        return create_key_response

    def list_api_keys(self):
        keys = self.client.keys.retrieve()
        print("API Keys:", json.dumps(keys, indent=2))
        return keys

    def retrieve_api_key(self, key_id=1):
        key = self.client.keys[key_id].retrieve()
        print("API Key details:", json.dumps(key, indent=2))
        return key

    def delete_api_key(self, key_id):
        deleted_key_response = self.client.keys[key_id].delete()
        print("API Key deletion response:", deleted_key_response)
        return deleted_key_response

    def nullify_upload_dates(self, collection_name):
        """
        Retrieve all documents in a collection and set their uploadDate field to null
        """
        print(f"Starting to nullify uploadDate for all documents in collection '{collection_name}'...")
        
        page = 1
        per_page = 100  # Process in batches of 100
        total_updated = 0
        
        while True:
            # Search for all documents in the collection
            search_parameters = {
                'q': '*',
                'query_by': '*',
                'page': page,
                'per_page': per_page
            }
            
            try:
                search_response = self.client.collections[collection_name].documents.search(search_parameters)
                hits = search_response.get('hits', [])
                
                if not hits:
                    print(f"No more documents found. Processed {total_updated} documents total.")
                    break
                
                print(f"Processing page {page}, found {len(hits)} documents...")
                
                # Update each document to set uploadDate to null
                for hit in hits:
                    document = hit['document']
                    doc_id = document['id']
                    
                    try:
                        # Create update payload with uploadDate set to null
                        update_data = dict(document)  # Copy existing document
                        update_data['uploadDate'] = None
                        
                        # Update the document
                        update_response = self.client.collections[collection_name].documents[doc_id].update(update_data)
                        total_updated += 1
                        
                        if total_updated % 10 == 0:  # Progress indicator every 10 updates
                            print(f"Updated {total_updated} documents...")
                            
                    except Exception as e:
                        print(f"Error updating document {doc_id}: {e}")
                        continue
                
                page += 1
                
            except Exception as e:
                print(f"Error searching collection on page {page}: {e}")
                break
        
        print(f"Completed! Successfully updated {total_updated} documents in collection '{collection_name}'")
        return total_updated

    def delete_all_documents(self, collection_name):
        result = self.client.collections[collection_name].documents.delete({"filter_by": "id:*"})
        print(f"All documents deleted from collection '{collection_name}':", result)
        return result


if __name__ == "__main__":
    manager = TypesenseManager()
    
    # manager.create_collection_prompts()
    # manager.create_collection_checkpoints()
    # manager.create_collection_loras()
    
    # manager.update_collection('promptnest_checkpoints')
    # manager.update_collection('promptnest_loras')
    
    # manager.nullify_upload_dates('promptnest_loras')

    # manager.delete_collection()
    # manager.search_documents('promptnest_checkpoints')
    # manager.search_documents('promptnest_loras')
    
    
    # Nullify uploadDate for all documents in collections
    # manager.nullify_upload_dates('promptnest_checkpoints')
    # manager.nullify_upload_dates('promptnest_loras')
    
    # manager.create_api_key()
    # manager.list_api_keys()
    # manager.retrieve_api_key()
    # manager.delete_api_key(2)
    
    # manager.delete_collection('promptnest_prompts')
    # manager.delete_collection('promptnest_checkpoints')
    # manager.delete_collection('promptnest_loras')
    
    # manager.delete_all_documents('promptnest_prompts')
    # manager.delete_all_documents('promptnest_checkpoints')
    # manager.delete_all_documents('promptnest_loras')
