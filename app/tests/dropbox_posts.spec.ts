import { assert, describe, it } from 'vitest'

import { getDropboxPaperDocuments, getDropboxPaperPost} from '../lib/dropbox_posts';

describe('Tutorial vitest', () => {
  it('Always wrong', async () => {
    assert.equal(1, 0)
  });
});
// Test Runnning
describe('Sample.ts Functions TestCases', () => {
  it('should return the squared value', async () => {
    const docs = await getDropboxPaperDocuments();
    console.dir(docs, {depth: null});

    const doc_id = docs[0].id;
    const doc = await getDropboxPaperPost(doc_id);
    console.log(doc, {depth: null});
  });
});
