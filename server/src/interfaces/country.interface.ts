export interface Country {
    readonly code: String;
    readonly name: String;
    readonly phone: String;
    readonly capital: String;
    readonly currency: String;
    readonly languages: Language[];
}


interface Language {
    name: String
}