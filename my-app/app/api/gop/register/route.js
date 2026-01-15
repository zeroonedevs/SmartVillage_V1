import pool from '../../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            orgName, category, contactPerson, designation,
            contactEmail, contactPhone, orgAddress, tenure, interestedDomains
        } = body;

        // Basic validation
        if (!orgName || !contactEmail || !contactPhone) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const client = await pool.connect();

        try {
            // Ensure table exists (Auto-migration for simplicity)
            await client.query(`
        CREATE TABLE IF NOT EXISTS gop_registrations (
          id SERIAL PRIMARY KEY,
          org_name VARCHAR(255) NOT NULL,
          category VARCHAR(100),
          contact_person VARCHAR(255) NOT NULL,
          designation VARCHAR(100),
          contact_email VARCHAR(255) NOT NULL,
          contact_phone VARCHAR(50) NOT NULL,
          org_address TEXT,
          tenure VARCHAR(50),
          interested_domains TEXT[],
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

            // Insert data
            const query = `
        INSERT INTO gop_registrations 
        (org_name, category, contact_person, designation, contact_email, contact_phone, org_address, tenure, interested_domains)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id;
      `;

            const values = [
                orgName, category, contactPerson, designation,
                contactEmail, contactPhone, orgAddress, tenure, interestedDomains
            ];

            const result = await client.query(query, values);

            return NextResponse.json({
                success: true,
                id: result.rows[0].id,
                message: 'Registration successful'
            });

        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
