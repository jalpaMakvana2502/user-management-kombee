export interface IUser {
  id: string;
  name: string;
  email: string;
  role_id: string;
  role: {
    id: string;
    name: string;
    guard_name: string | null;
    landing_page: string | null;
  };
  dob: string;
  profile: string;
  profile_original: string;
  profile_thumbnail: string;
  gender: string;
  gender_text: string;
  status: string;
  status_text: string;
  email_verified_at: string | null;
  user_galleries?: IUserGallery[];
  user_pictures?: IUserPictures[];
}

interface IUserGallery {
  id: string;
  user_id: string;
  gallery: string;
  gallery_original: string;
  gallery_thumbnail: string;
}

interface IUserPictures {
  id: string;
  user_id: string;
  picture: string;
  picture_original: string;
  picture_thumbnail: string;
}

export interface IRole {
  id: string;
  name: string;
  guard_name: string | null;
  landing_page: string | null;
}
