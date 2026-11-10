
export interface Officer {
  name: string;
  position: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  bookingUrl?: string;
  imageUrl?: string;
  bio?: string;
}

export const PRESIDENCY: Officer[] = [
  {
    name: "Ella Moore",
    position: "Co-President",
    linkedinUrl: "https://www.linkedin.com/in/ella-moore24/",
    imageUrl: "/img/ella.jpeg",
    bio: "Ella is a Strategic Management major from the Bay Area currently working at Indigo Institute an edtech startup. She is passionate about the intersection of people and products and is currently the Vice President of Events for the Women in Strategy Association. Ella excels at increasing organizational efficiency and planning impactful events that foster collaboration and community.",
  },
  {
    name: "Nathan McCauley",
    position: "Co-President",
    linkedinUrl: "https://www.linkedin.com/in/nate-mccauley/",
    imageUrl: "/img/nate.jpeg",
    bio: 'Nate is a San Francisco native majoring in Strategic Management with a minor in Computer Science. He has PM experience at Instructure (Canvas LMS) and a background in private equity software investing. Nate is dedicated to empowering learners with AI and enjoys "Vibe Coding" AI SaaS products on the weekends.',
  },
  {
    name: "Sophie Strong",
    position: "VP of Community Growth",
    imageUrl: "/img/team/sophie-strong.jpg",
    linkedinUrl: "https://www.linkedin.com/in/sophia-strong/",
  },
  {
    name: "Jordan Faust",
    position: "VP of Marketing",
    imageUrl: "/img/team/jordan-faust.jpg",
    linkedinUrl: "https://www.linkedin.com/in/jordan-faust-5a1028207/",
  },
  {
    name: "Lance Kirkpatrick",
    position: "VP of Event Logistics",
    imageUrl: "/img/team/lance-kirkpatrick.jpg",
    linkedinUrl: "https://www.linkedin.com/in/lance-kirkpatrick-30a502237/",
  },
  {
    name: "Truman Dangerfield",
    position: "VP of Alumni + Company Relations",
    imageUrl: "/img/team/truman-dangerfield.jpg",
    linkedinUrl: "https://www.linkedin.com/in/trumandangerfield/",
  },
  {
    name: "Nathan Irizarry",
    position: "VP of Student Development",
    imageUrl: "/img/team/nathan-irizarry.jpg",
    linkedinUrl: "https://www.linkedin.com/in/nathan-irizarry/",
  },
  {
    name: "Logan West",
    position: "VP of Student Development",
    imageUrl: "/img/team/logan-west.jpg",
    linkedinUrl: "https://www.linkedin.com/in/loganwest03/",
  },
  {
    name: "Daniel Wait",
    position: "VP of Tech",
    imageUrl: "/img/team/daniel-wait.jpg",
    linkedinUrl: "https://www.linkedin.com/in/danielwait2/",
  },
  {
    name: "Heber Jones",
    position: "VP of Tech",
    imageUrl: "/img/team/heber-jones.jpg",
    linkedinUrl: "https://www.linkedin.com/in/heber-jones/",
  },
];

export const FACULTY: Officer[] = [
  {
    name: "Scott Murff",
    position: "Faculty Advisor",
    bio: "Scott is a Professor of Strategy at BYU. With experience at McKinsey & Company he is passionate about helping students develop their product management skills and is excited to be a part of the PM Association.",
  },
];

export const FORMER_OFFICERS: Officer[] = [
  { name: "Dylan Mattern", position: "Co-President", linkedinUrl: "https://www.linkedin.com/in/dylan-mattern/" },
  { name: "Carter Field", position: "VP of Growth", linkedinUrl: "https://www.linkedin.com/in/carterfield02/" },
  { name: "Mick Buck", position: "VP of Events", linkedinUrl: "https://www.linkedin.com/in/mick-buck/" },
  {
    name: "Justin Maxwell",
    position: "VP of Technology",
    linkedinUrl: "https://www.linkedin.com/in/maxwell-justin/",
  },
];
