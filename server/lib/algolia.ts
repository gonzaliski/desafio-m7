// For the default version
import algoliasearch from 'algoliasearch'

const client = algoliasearch('C9JDNR23OA', 'a1d4e8bc8f88274bdee143e03795996a');
export const index = client.initIndex('pets_apx');
