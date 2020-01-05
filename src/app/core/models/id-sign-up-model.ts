export class IdSignUpModel {
    constructor() { this.capturedInfo = new CapturedInfo();}
    public id_type: string;
    public mrz: boolean;
    public line1: string;
    public line2: string;
    public line3: string;
    public frontImage: string;
    public backImage: string;
    public capturedImage: string;
    public capturedInfo: CapturedInfo;
}

export class CapturedInfo {
    id_number: string;
    document_number: string;
    expiration_date: Date;
    passport_photo: string
    driver_license_photo: string;
    driver_license_back_photo: string;
    first_name: string;
    last_name: string;
    password: string;
    isStage: string;
    id_type: string;

    dob: Date;
    documentnumber: string
    expirationdate: Date
    fname: string
    idtype: string;
    lname: string;
    fullname: string;
}
