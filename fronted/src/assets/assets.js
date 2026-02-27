import appointment_img from './appointment_img.png'
import header_img from './header_img.png'
import header_img2 from './header_img2.png'
import group_profiles from './group_profiles.png'
import group_profiles2 from './group_profiles2.png'
import profile_pic from './profile_pic.png'
import contact_image from './contact_image.png'
import about_image from './about_image.png'
import logo from './logo.svg'
import logo2 from './logo2.svg'
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import chats_icon from './chats_icon.svg'
import verified_icon from './verified_icon.svg'
import arrow_icon from './arrow_icon.svg'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import stripe_logo from './stripe_logo.png'
import razorpay_logo from './razorpay_logo.png'
import doc1 from './doc1.png'
import doc2 from './doc2.png'
import doc3 from './doc3.png'
import doc4 from './doc4.png'
import doc5 from './doc5.png'
import doc6 from './doc6.png'
import doc7 from './doc7.png'
import doc8 from './doc8.png'
import doc9 from './doc9.png'
import doc10 from './doc10.png'
import doc11 from './doc11.png'
import doc12 from './doc12.png'
import doc13 from './doc13.png'
import doc14 from './doc14.png'
import doc15 from './doc15.png'
import Dermatologist from './Dermatologist.svg'
import Gastroenterologist from './Gastroenterologist.svg'
import General_physician from './General_physician.svg'
import Gynecologist from './Gynecologist.svg'
import Neurologist from './Neurologist.svg'
import Pediatricians from './Pediatricians.svg'


export const assets = {
    appointment_img,
    header_img,
    group_profiles,
    logo,
    chats_icon,
    verified_icon,
    info_icon,
    profile_pic,
    arrow_icon,
    contact_image,
    about_image,
    menu_icon,
    cross_icon,
    dropdown_icon,
    upload_icon,
    stripe_logo,
    razorpay_logo,
    header_img2,
    group_profiles2
}

export const specialityData = [
    {
        speciality: 'General physician',
        image: General_physician
    },
    {
        speciality: 'Gynecologist',
        image: Gynecologist
    },
    {
        speciality: 'Dermatologist',
        image: Dermatologist
    },
    {
        speciality: 'Pediatricians',
        image: Pediatricians
    },
    {
        speciality: 'Neurologist',
        image: Neurologist
    },
    {
        speciality: 'Gastroenterologist',
        image: Gastroenterologist
    },
]

export const doctors = [
  {
    _id: 'doc1',
    name: 'Dr. Ankit Sharma',
    image: doc1,
    speciality: 'General physician',
    degree: 'MBBS',
    experience: '4 Years',
    about: 'Dr. Sharma focuses on preventive care, early diagnosis, and effective treatment strategies for common medical conditions.',
    fees: 500,
    address: {
      line1: '17th Cross, Indiranagar',
      line2: 'Bangalore, Karnataka'
    }
  },
  {
    _id: 'doc2',
    name: 'Dr. Neha Patel',
    image: doc2,
    speciality: 'Gynecologist',
    degree: 'MBBS',
    experience: '3 Years',
    about: 'Dr. Patel specializes in women’s health, prenatal care, and minimally invasive gynecological procedures.',
    fees: 600,
    address: {
      line1: 'Law Garden Road',
      line2: 'Ahmedabad, Gujarat'
    }
  },
  {
    _id: 'doc3',
    name: 'Dr. Riya Mehta',
    image: doc3,
    speciality: 'Dermatologist',
    degree: 'MBBS, MD',
    experience: '1 Year',
    about: 'Dr. Mehta treats skin, hair, and nail conditions with a patient-first approach.',
    fees: 400,
    address: {
      line1: 'JM Road',
      line2: 'Pune, Maharashtra'
    }
  },
  {
    _id: 'doc4',
    name: 'Dr. Arjun Iyer',
    image: doc4,
    speciality: 'Pediatricians',
    degree: 'MBBS, MD',
    experience: '2 Years',
    about: 'Dr. Iyer provides compassionate medical care for infants, children, and adolescents.',
    fees: 450,
    address: {
      line1: 'Anna Nagar',
      line2: 'Chennai, Tamil Nadu'
    }
  },
  {
    _id: 'doc5',
    name: 'Dr. Suresh Rao',
    image: doc5,
    speciality: 'Neurologist',
    degree: 'MBBS, DM',
    experience: '4 Years',
    about: 'Dr. Rao diagnoses and treats disorders of the brain and nervous system.',
    fees: 800,
    address: {
      line1: 'Banjara Hills',
      line2: 'Hyderabad, Telangana'
    }
  },
  {
    _id: 'doc6',
    name: 'Dr. Pooja Malhotra',
    image: doc6,
    speciality: 'Neurologist',
    degree: 'MBBS, DM',
    experience: '4 Years',
    about: 'Dr. Malhotra is experienced in managing neurological disorders with evidence-based care.',
    fees: 750,
    address: {
      line1: 'South Extension',
      line2: 'New Delhi'
    }
  },
  {
    _id: 'doc7',
    name: 'Dr. Rahul Verma',
    image: doc7,
    speciality: 'General physician',
    degree: 'MBBS',
    experience: '4 Years',
    about: 'Dr. Verma believes in holistic healthcare and preventive medicine.',
    fees: 500,
    address: {
      line1: 'Alambagh',
      line2: 'Lucknow, Uttar Pradesh'
    }
  },
  {
    _id: 'doc8',
    name: 'Dr. Himanshsu Nair',
    image: doc8,
    speciality: 'Gynecologist',
    degree: 'MBBS, MD',
    experience: '3 Years',
    about: 'Dr. Nair provides personalized care for women across all stages of life.',
    fees: 650,
    address: {
      line1: 'Vyttila',
      line2: 'Kochi, Kerala'
    }
  },
  {
    _id: 'doc9',
    name: 'Dr. Aman Singh',
    image: doc9,
    speciality: 'Dermatologist',
    degree: 'MBBS, MD',
    experience: '1 Year',
    about: 'Dr. Singh focuses on modern dermatological treatments and patient education.',
    fees: 400,
    address: {
      line1: 'Malviya Nagar',
      line2: 'Jaipur, Rajasthan'
    }
  }
];
