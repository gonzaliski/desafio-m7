// For the default version
import algoliasearch from 'algoliasearch'

const client = algoliasearch(process.env.ALGOLIA_APP_ID as string, 
    process.env.ALGOLIA_API_KEY as string);
export const index = client.initIndex('pets_apx');
