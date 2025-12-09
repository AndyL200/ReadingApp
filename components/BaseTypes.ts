import { Double } from "react-native/Libraries/Types/CodegenTypes"

//class for sub viewer components like ads and suggestions that should be tailored to the user
export abstract class Personalizer {
    constructor(public user: string) {}

    abstract comp(): React.ReactNode;
}
export abstract class MediaTypes {

}
export type Itemizer = {
    //content id
    doc_id : number,
    content : string,
    page_count: number //Integer
    current_page?: number //Integer
}