import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Award from '../../../../models/Award';

// Import existing awards data
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
        // Check authentication
        const authCookie = request.cookies.get('gop_admin_session');
        if (!authCookie || authCookie.value !== 'authenticated') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await dbConnect();

        let imported = 0;
        let skipped = 0;
        const errors = [];

        for (const awardItem of existingAwards) {
            try {
                // Check if award already exists (by title and year)
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
                    imported++;
                } else {
                    skipped++;
                }
            } catch (error) {
                errors.push(`Failed to import "${awardItem.title}": ${error.message}`);
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Awards migration completed',
            imported,
            skipped,
            total: existingAwards.length,
            errors: errors.length > 0 ? errors : undefined
        }, { status: 200 });

    } catch (error) {
        console.error('Migration error:', error);
        return NextResponse.json(
            { error: 'Failed to migrate awards', details: error.message },
            { status: 500 }
        );
    }
}
