import fetch from 'node-fetch'
import dropbox from 'dropbox';

const dbx = new dropbox.Dropbox({ accessToken: process.env.DROPBOX_TOKEN });

const httpClient = async (
    url: string,
    token: string,
    body: object,
    headers: object
   ) => {
    const options: any = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
//        ...headers
      }
    }
    if (body) {
      options.body = JSON.stringify(body)
    }
    const res = await fetch(url, options)
    if (res.ok && body) {
      return res.json()
    } else if (res.ok) {
      return res.text()
    } else {
      return {}  
      // const errorMsg = await res.text()
      // throw new Error(errorMsg)
    }
   }

async function getDropboxPaperDocuments() {
    const respFeatures = await dbx.usersFeaturesGetValues({features: [{".tag": "paper_as_files"}]})
    if(respFeatures.status != 200){
        throw respFeatures
    }
    const featurePaperAsFiles = respFeatures.result.values
        .filter(e => "paper_as_files" in e)[0] as dropbox.users.UserFeatureValuePaperAsFiles;
    if((featurePaperAsFiles.paper_as_files as dropbox.users.PaperAsFilesValueEnabled).enabled) {
        throw "Not Implemented"
    } 

    const resp = await dbx.paperDocsList(
        {
            sort_by: <dropbox.paper.ListPaperDocsSortByModified>{".tag": "modified"},
            sort_order:  <dropbox.paper.ListPaperDocsSortOrderDescending>{".tag": "descending"}
        });
    if(resp.status != 200){
        throw resp
    }
    if(resp.result.has_more) {
        throw "docs_ids has more. not implemented"
    }

    const promiseAllProps = async (object: object) => {
        return Promise.all(Object.values(object)).then((results) => (
          Object.keys(object).reduce((fulfilledObject: any, key: string, index: number) => {
            fulfilledObject[key] = results[index];
            return fulfilledObject;
          }, {})
        ));
    }
    const paperDocs = await Promise.all(resp.result.doc_ids.map(id => promiseAllProps({
            id,
            metadata: httpClient(
                'https://api.dropboxapi.com/2/paper/docs/get_metadata', 
                `${process.env.DROPBOX_TOKEN}`,
                {doc_id: id},
                []
            ),
            folder: httpClient(
                'https://api.dropboxapi.com/2/paper/docs/get_folder_info', 
                `${process.env.DROPBOX_TOKEN}`,
                {doc_id: id},
                []
            )
    })))
    return paperDocs.sort((a:any, b:any) => {
        const date_a = a.metadata.last_modified_update;
        const date_b = b.metadata.last_modified_update;
        if(date_a > date_b) {
            return 1
        } else if (date_a < date_b) {
            return -1
        } else {
            return 0
        }
    })
}

(async () => {
   const docs = await getDropboxPaperDocuments();
   console.dir(docs, {depth: null});
})();
