export interface User{
    "id": number,
    "username": string,
    "email": string,
    "roles": string[],
    "status"?: number,
    "numBills"?: number,
    "numComments"?: number,
    "numAddresses"?: number,
    "birthday"?: string,
    "gender"?: number
}
  