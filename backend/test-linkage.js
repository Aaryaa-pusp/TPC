const mongoose = require('mongoose');

const testWorkflow = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/tpc-portal');
        
        // 1. Get Super Admin Token
        await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'superadmin@gmail.com', role: 'admin' })
        });
        const adminLogin = await fetch('http://localhost:5000/api/auth/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'superadmin@gmail.com', otp: '123' })
        });
        const { token: adminToken } = await adminLogin.json();

        // 2. Admin Creates an Event linked to Company
        const postRes = await fetch('http://localhost:5000/api/admin/events', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + adminToken, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: 'Data Structures Bootcamp',
                description: 'Testing if this links properly.',
                type: 'internship',
                startDate: new Date(),
                deadlineEnd: new Date(Date.now() + 86400000),
                targetBranches: ['CSE'],
                companyEmail: 'comp@gmail.com'
            })
        });
        const eventRes = await postRes.json();
        console.log('Event Created Linked to Company:', postRes.status);

        // 3. Setup dummy logic simulating a student applying to this event
        const EventModel = mongoose.model('Event', new mongoose.Schema({ appliedStudents: [String], companyRef: mongoose.Schema.Types.ObjectId }, { strict: false }));
        await EventModel.findByIdAndUpdate(eventRes.event._id, { $push: { appliedStudents: 'stud@gmail.com' } });
        console.log('Dummy student applied via Mongo DB.');
        
        // 4. Get Company Token
        await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'comp@gmail.com', role: 'company' })
        });
        const compLogin = await fetch('http://localhost:5000/api/auth/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'comp@gmail.com', otp: '123' })
        });
        const { token: compToken } = await compLogin.json();

        // 5. Verify Company Events API returns the linked event
        const compEventsRes = await fetch('http://localhost:5000/api/company/events', {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + compToken }
        });
        const compEventsData = await compEventsRes.json();
        const hasLinkedEvent = compEventsData.events.find(e => e._id === eventRes.event._id);
        console.log('Company successfully sees linked event in dropdown:', !!hasLinkedEvent);

        // 6. Verify Company Applicants API returns the applied student
        const compStudRes = await fetch('http://localhost:5000/api/company/students?eventId=' + eventRes.event._id, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + compToken }
        });
        const compStudData = await compStudRes.json();
        console.log('Company Applicants Logic fetched students count:', compStudData.students?.length);
        
        // Cleanup Data
        await fetch('http://localhost:5000/api/admin/events/' + eventRes.event._id, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + adminToken }
        });
        await mongoose.disconnect();
        console.log('Test completed and cleaned up.');
    } catch (e) {
        console.error('Test Flow Error:', e);
    }
}
testWorkflow();
