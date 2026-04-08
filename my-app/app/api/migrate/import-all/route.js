import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import News from '../../../../models/News';
import Award from '../../../../models/Award';


const existingNews = [
  {
    title: "Students painting on the walls of MPP school",
    date: "15-08-2023",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/svrwebsite-1e892.appspot.com/o/news%2Fstudents%20painting.jpg?alt=media&token=0f3d3b48-e310-4d3d-aaba-bbc21ffca393",
    excerpt: "A rural village in India has successfully transitioned to 100% renewable energy, setting a precedent for sustainable development in remote areas.",
    link: 'https://kluniversityin-my.sharepoint.com/:i:/g/personal/2300030350_kluniversity_in/Ec64JtI9j0lAt2ZEaIp1iMwBNfWdpSnBNFlYjPDqyGripw?e=YfAZRl',
  },
  {
    title: "Pharmacy students conducting blood group tests for villagers in Musi again village",
    date: "30-05-2024",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/svrwebsite-1e892.appspot.com/o/news%2FHealth%20Services.png?alt=media&token=fc7baf56-42eb-4948-bd7b-67d80d15cbec",
    excerpt: "A village in rural Africa is empowering women by reviving traditional crafts, providing them with sustainable livelihoods and preserving cultural heritage.",
    link: 'https://kluniversityin-my.sharepoint.com/:i:/g/personal/venkatasatyanarayana_kluniversity_in/Eca4jy_gndFKgbnHf8vtzlIBPMe93xfzdngGq1Y2ZBPmsA?e=1ykj8q',
  },
  {
    title: "Family Welfare Commissioner J Niwas talking about medical services",
    date: "22-07-2024",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/svrwebsite-1e892.appspot.com/o/news%2FHeath%20Minister%20speech.png?alt=media&token=119f26b4-6e8b-4a64-8e20-5d321147419f",
    excerpt: "Villages in drought-prone areas are adopting innovative water conservation techniques, ensuring water availability for future generations.",
    link: 'https://kluniversityin-my.sharepoint.com/:i:/g/personal/venkatasatyanarayana_kluniversity_in/EVS-kqO5NWJIpXvi3BcBDSwBl2mfFcYWG9bpAVLVQ0YJDQ?e=vg5RyU',
  },
  {
    title: "KLU students organizing Swachh Bharat in Tadepalli",
    date: "05-08-2024",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/svrwebsite-1e892.appspot.com/o/news%2FKl%20Students%20awareness.png?alt=media&token=7c76e7bb-384e-4991-87e1-e48a07bec467",
    excerpt: "A program introducing smart farming practices is revitalizing agriculture in remote villages, increasing crop yields and improving food security.",
    link: 'https://kluniversityin-my.sharepoint.com/:i:/g/personal/venkatasatyanarayana_kluniversity_in/ESYFLo14SjdNg8EA5Qxl4Y0BwIw0zPQj-79LB1YzZTKBQQ?e=wz0ztM',
  },
  {
    title: "Students conducting a ralley against plastic along with higher officials",
    date: "28-09-2019",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/svrwebsite-1e892.appspot.com/o/news%2Frevolution.png?alt=media&token=3b5e8f62-fa87-4819-abe5-182cbb5922c2",
    excerpt: "A ralley was conducted against use of plastic along with MLA Vasantha in the village Milavaram for a better society.",
    link: '',
  },
  {
    title: "Village walls turns canvass for youth",
    date: "10-08-2024",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/svrwebsite-1e892.appspot.com/o/news%2Fvillage%20walls.png?alt=media&token=d01cda0a-7c20-40b3-9f90-e364ac27f01a",
    excerpt: "Students paint a wall in Vellatur village in Krishna district as part of the Smart Village Revolution programme",
    link: "https://kluniversityin-my.sharepoint.com/:i:/g/personal/venkatasatyanarayana_kluniversity_in/EatYBIk6jERBhuH-sqYbA8MBvW97wICpXoZ-ZeMyiUxEVg?e=26MsBn",
  },
  {
    title: "An initiative on a village developement committee in Vellaturu",
    date: "10-08-2024",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/svrwebsite-1e892.appspot.com/o/news%2Fvillage%20committee.png?alt=media&token=747767c2-cd80-4f26-ac46-ce03d4292e8e",
    excerpt: "Students of KL University took an initiative in a Village Developement Committee as a part of Smart Village Revolution",
    link: 'https://kluniversityin-my.sharepoint.com/:i:/g/personal/venkatasatyanarayana_kluniversity_in/ERcUdu6siX5Cqx-BjtNHcvMBhQUUtPVrU_Qe7Mavr-otWA?e=OymVsH',
  },
  {
    title: "Students demonstrating against plastic ban",
    date: "10-08-2024",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/svrwebsite-1e892.appspot.com/o/news%2FPlastic.png?alt=media&token=44f3231c-f4a3-4626-913b-14eb44619dab",
    excerpt: "Digital education initiatives are transforming schools in rural villages, bridging the educational gap and providing new opportunities for children.",
    link: 'https://kluniversityin-my.sharepoint.com/:i:/g/personal/venkatasatyanarayana_kluniversity_in/EXhrhxRvyjRHmJkHiGCljxkBriMXpk4QhbSU_2hBOfaPFQ?e=RpUnn5',
  },
  {
    title: "Awareness demonstration on right to vote",
    date: "10-08-2024",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/svrwebsite-1e892.appspot.com/o/news%2FVote.png?alt=media&token=ff4e0270-ca41-40f3-8384-948c08ec1718",
    excerpt: "Digital education initiatives are transforming schools in rural villages, bridging the educational gap and providing new opportunities for children.",
    link: 'https://kluniversityin-my.sharepoint.com/:i:/g/personal/2300030350_kluniversity_in/EY-Tgm9xm9RLputyXtFJdUgBZjznVYXlmZ0Y6P_ABXZIRQ?e=GYuW1f',
  },
  {
    title: "KLU students on a 10-day tour of Nallamalla tribal temple",
    date: "10-08-2024",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/svrwebsite-1e892.appspot.com/o/news%2Fnallamalla.png?alt=media&token=6efea935-445c-4c34-a84b-eef4e2007c91",
    excerpt: "Digital education initiatives are transforming schools in rural villages, bridging the educational gap and providing new opportunities for children.",
    link: 'https://kluniversityin-my.sharepoint.com/:i:/g/personal/2300030350_kluniversity_in/ETn6xFZWAeVGuQZ9XSLi2rIBq2xq5DCdgckBoPV8h7P2WA?e=3e7EP1',
  },
  {
    title: "KU students are conducting a survey to be aware of seasonal diseases",
    date: "10-08-2024",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/svrwebsite-1e892.appspot.com/o/news%2Fsesonal%20Diseases.png?alt=media&token=60a0df34-f8a7-4e96-8925-55c0e7b99645",
    excerpt: "Digital education initiatives are transforming schools in rural villages, bridging the educational gap and providing new opportunities for children.",
    link: 'https://kluniversityin-my.sharepoint.com/:i:/g/personal/2300030350_kluniversity_in/EQ2tE4q5on1Nium2lfbR__8BqdvCN2GZdMeAI0G7K_4laQ?e=y1R4Io',
  },
  {
    title: "KL University students participated in the Kavulur health survey",
    date: "10-08-2024",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/svrwebsite-1e892.appspot.com/o/news%2FHealth%20Camp.png?alt=media&token=bb343e1e-adeb-48fb-a76b-e5081fc84236",
    excerpt: "Digital education initiatives are transforming schools in rural villages, bridging the educational gap and providing new opportunities for children.",
    link: 'https://kluniversityin-my.sharepoint.com/:i:/g/personal/2300030350_kluniversity_in/Ea0gaZJqIGlGttRYZY3cxkUBo05n76pybfJgOZa0RGpHhw?e=4Z1XFK',
  },
];


const existingAwards = [
    {
        title: "Social Impact Excellence",
        image: "https://i.imghippo.com/files/QI7955AxM.png",
        description: "In 2022, KL University won the 'Outreach and Society' award for its Smart Village Revolution (SVR), recognizing efforts in rural development and societal well-being.",
        year: "2022"
    },
    {
        title: "Best Village Development Project",
        image: "https://i.imghippo.com/files/jlUa1209myY.png",
        description: "In 2023, Mr. K. UdayKiran won the 'Best Project of the Year' award from the Police Department for his innovative security alarm system, enhancing safety in villages.",
        year: "2023"
    },
    {
        title: "Best Village Development Project",
        image: "https://i.imghippo.com/files/zmXC3389OaI.png",
        description: "In 2024, Chaitanya and Kalyan received the award from the Election Commission of India for innovative public awareness initiatives.",
        year: "2024"
    },
    {
        title: "Best Village Development Project",
        image: "https://i.imghippo.com/files/rc8332QE.png",
        description: "Mr. J. V. Kalyan received appreciation from HANDS for his outstanding contribution to Cardiopulmonary Resuscitation (CPR) training.",
        year: "2024"
    },
    {
        title: "Best Village Development Project",
        image: "https://i.imghippo.com/files/qh5232gvs.png",
        description: "Received the Fellowship Award from APSACS Department for exceptional contributions to public health and awareness initiatives.",
        year: "2024"
    },
    {
        title: "Best Village Development Project",
        image: "https://i.imghippo.com/files/FD9892Urk.png",
        description: "Received the 27TH NATIONAL YOUTH FESTIVAL Award from ministry of youth affairs and sports.",
        year: "2024"
    },
    {
        title: "Best Village Development Project",
        image: "https://i.imghippo.com/files/Gd2054A.png",
        description: "Sk. Sameera has been appointed as the Zonal Incharge for AISU (All India Students Union), showcasing her leadership and dedication to student welfare in Community development.",
        year: "2024"
    },
    {
        title: "Best Village Development Project",
        image: "https://i.imghippo.com/files/Fk7604VQ.png",
        description: "D. Amarnadh secured 1st prize in the National-level Agri-Drone competition, demonstrating exceptional innovation and expertise in agricultural technology.",
        year: "2023"
    },
];

export async function POST(request) {
    try {
        
        const authCookie = request.cookies.get('gop_admin_session');
        if (!authCookie || authCookie.value !== 'authenticated') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await dbConnect();

        
        let newsImported = 0;
        let newsSkipped = 0;
        const newsErrors = [];

        for (const newsItem of existingNews) {
            try {
                const existing = await News.findOne({
                    title: newsItem.title,
                    date: newsItem.date
                });

                if (!existing) {
                    await News.create({
                        title: newsItem.title,
                        date: newsItem.date,
                        imageUrl: newsItem.imageUrl,
                        excerpt: newsItem.excerpt,
                        link: newsItem.link || ''
                    });
                    newsImported++;
                } else {
                    newsSkipped++;
                }
            } catch (error) {
                newsErrors.push(`News: "${newsItem.title}": ${error.message}`);
            }
        }

        
        let awardsImported = 0;
        let awardsSkipped = 0;
        const awardsErrors = [];

        for (const awardItem of existingAwards) {
            try {
                const existing = await Award.findOne({
                    title: awardItem.title,
                    year: awardItem.year
                });

                if (!existing) {
                    await Award.create({
                        title: awardItem.title,
                        year: awardItem.year,
                        image: awardItem.image,
                        description: awardItem.description
                    });
                    awardsImported++;
                } else {
                    awardsSkipped++;
                }
            } catch (error) {
                awardsErrors.push(`Award: "${awardItem.title}": ${error.message}`);
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Migration completed',
            news: {
                imported: newsImported,
                skipped: newsSkipped,
                total: existingNews.length
            },
            awards: {
                imported: awardsImported,
                skipped: awardsSkipped,
                total: existingAwards.length
            },
            errors: [...newsErrors, ...awardsErrors].length > 0 
                ? [...newsErrors, ...awardsErrors] 
                : undefined
        }, { status: 200 });

    } catch (error) {
        console.error('Migration error:', error);
        return NextResponse.json(
            { error: 'Failed to migrate data', details: error.message },
            { status: 500 }
        );
    }
}
