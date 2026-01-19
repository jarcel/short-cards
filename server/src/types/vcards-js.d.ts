declare module 'vcards-js' {
  interface Address {
    street: string;
    city: string;
    stateProvince: string;
    postalCode: string;
    countryRegion: string;
  }

  interface VCard {
    firstName: string;
    lastName: string;
    middleName: string;
    namePrefix: string;
    nameSuffix: string;
    email: string;
    homePhone: string;
    cellPhone: string;
    workPhone: string;
    organization: string;
    title: string;
    url: string;
    note: string;
    homeAddress: Address;
    workAddress: Address;
    getFormattedString(): string;
  }

  function vCardsJS(): VCard;
  export = vCardsJS;
}
