export const DOCSTAT_ACTIVE: string = "有效";
export const DOCSTAT_ABATED: string = "作废";
export const DOCSTATS: string[] = [DOCSTAT_ACTIVE, DOCSTAT_ABATED];

export var isLogin: boolean;

export function fileType(fileName: string): string{
    var dot = fileName.lastIndexOf('.');
    var docType = fileName.slice(dot+1);
    console.log(docType)
    if (docType === 'pdf'){
        docType = "application/pdf";
     }
     else if (docType === 'jpg' || docType === 'gif' || docType === 'png' || docType ==='jpeg' || docType === 'bmp'){
        docType = 'image/jpeg';
    }
    return docType;
}
