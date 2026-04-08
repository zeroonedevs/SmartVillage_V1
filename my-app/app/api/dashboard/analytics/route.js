import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Activity from '../../../../models/Activity';
import Village from '../../../../models/Village';
import User from '../../../../models/User';
import Award from '../../../../models/Award';
import News from '../../../../models/News';
import Gallery from '../../../../models/Gallery';
import GopRegistration from '../../../../models/GopRegistration';
import Staff from '../../../../models/Staff';

function checkAdminAuth(request) {
    const authCookie = request.cookies.get('gop_admin_session');
    const roleCookie = request.cookies.get('user_role');
    if (!authCookie || authCookie.value !== 'authenticated' || roleCookie?.value !== 'admin') {
        return false;
    }
    return true;
}

export async function GET(request) {
    try {
        if (!checkAdminAuth(request)) {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 401 }
            );
        }

        await dbConnect();

        const [
            userCount,
            villageCount,
            activityCount,
            awardCount,
            newsCount,
            galleryCount,
            registrationCount,
            staffCount,
            totalStudentsAgg,
            studentParticipationByMonth,
            activitiesByDomain,
            activitiesByYear,
            villagesByDistrict,
            galleryByDomain,
            registrationsByMonth,
            gopInterestedDomains,
            usersByRole,
            awardsByYear,
        ] = await Promise.all([
            User.countDocuments(),
            Village.countDocuments(),
            Activity.countDocuments(),
            Award.countDocuments(),
            News.countDocuments(),
            Gallery.countDocuments(),
            GopRegistration.countDocuments(),
            Staff.countDocuments(),
            Activity.aggregate([
                { $group: { _id: null, total: { $sum: '$studentsParticipated' } } },
            ]),
            Activity.aggregate([
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
                        totalStudents: { $sum: '$studentsParticipated' },
                        activityCount: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
            ]),
            Activity.aggregate([
                { $match: { domain: { $ne: null, $ne: '' } } },
                { $group: { _id: '$domain', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]),
            Activity.aggregate([
                { $match: { year: { $ne: null, $ne: '' } } },
                {
                    $group: {
                        _id: '$year',
                        count: { $sum: 1 },
                        students: { $sum: '$studentsParticipated' },
                    },
                },
                { $sort: { _id: 1 } },
            ]),
            Village.aggregate([
                { $group: { _id: '$district', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]),
            Gallery.aggregate([
                { $group: { _id: '$domain', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]),
            GopRegistration.aggregate([
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
            ]),
            GopRegistration.aggregate([
                { $unwind: '$interestedDomains' },
                { $group: { _id: '$interestedDomains', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]),
            User.aggregate([
                { $group: { _id: '$role', count: { $sum: 1 } } },
            ]),
            Award.aggregate([
                { $group: { _id: '$year', count: { $sum: 1 } } },
                { $sort: { _id: 1 } },
            ]),
        ]);

        return NextResponse.json({
            success: true,
            data: {
                counts: {
                    users: userCount,
                    villages: villageCount,
                    activities: activityCount,
                    awards: awardCount,
                    news: newsCount,
                    gallery: galleryCount,
                    registrations: registrationCount,
                    staff: staffCount,
                    totalStudents: totalStudentsAgg.length > 0 ? totalStudentsAgg[0].total : 0,
                },
                studentParticipationByMonth: studentParticipationByMonth.map((item) => ({
                    month: item._id,
                    totalStudents: item.totalStudents,
                    activityCount: item.activityCount,
                })),
                activitiesByDomain: activitiesByDomain.map((item) => ({
                    name: item._id,
                    value: item.count,
                })),
                activitiesByYear: activitiesByYear.map((item) => ({
                    year: item._id,
                    count: item.count,
                    students: item.students,
                })),
                villagesByDistrict: villagesByDistrict.map((item) => ({
                    name: item._id,
                    count: item.count,
                })),
                galleryByDomain: galleryByDomain.map((item) => ({
                    name: item._id,
                    value: item.count,
                })),
                registrationsByMonth: registrationsByMonth.map((item) => ({
                    month: item._id,
                    count: item.count,
                })),
                gopInterestedDomains: gopInterestedDomains.map((item) => ({
                    name: item._id,
                    count: item.count,
                })),
                usersByRole: usersByRole.map((item) => ({
                    name: item._id,
                    value: item.count,
                })),
                awardsByYear: awardsByYear.map((item) => ({
                    year: item._id,
                    count: item.count,
                })),
            },
        });
    } catch (error) {
        console.error('Analytics API error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch analytics data' },
            { status: 500 }
        );
    }
}
