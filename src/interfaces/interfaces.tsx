// interface User {
//     id: string;
//     description: string;
//     first_name: string;
//     last_name: string;
//     org_name: string;
//     email: string;
//     phone: string;
//     site_url: string;
//     posts: number;
//     // Add other user properties here
//   }
  
export interface ProfileEditData {
      org_name: string;
      description: string;
      phone: string;
      site_url: string;
      first_name: string;
      last_name: string;
      email: string;
};
  
  
    
export interface User {
      id: string;
      description: string;
      first_name: string;
      last_name: string;
      org_name: string;
      email: string;
      site_url: string;
      phone: string;
      posts: number;
      // Add other user properties here
};
    
  