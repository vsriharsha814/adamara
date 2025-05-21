import React from 'react';

const ContactUs = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Contact Us</h1>
        <p className="text-lg text-gray-600">
          We&apos;re here to help with your advertising needs. Here&apos;s how you can reach us.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Company Address */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-start mb-4">
            <svg className="h-6 w-6 text-blue-600 mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-1">Office Address</h2>
              <address className="not-italic text-gray-600">
                Amaravati Communications Pvt. Ltd.<br />
                123 Business Park, Suite 456<br />
                Amaravati City, AM 54321<br />
                India
              </address>
            </div>
          </div>
          
          <div className="flex items-start mb-4">
            <svg className="h-6 w-6 text-blue-600 mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-1">Phone</h2>
              <p className="text-gray-600">
                <a href="tel:+91-9876543210" className="hover:text-blue-600">+91 987 654 3210</a>
              </p>
              <p className="text-gray-600">
                <a href="tel:+91-1234567890" className="hover:text-blue-600">+91 123 456 7890</a> (Toll-free)
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <svg className="h-6 w-6 text-blue-600 mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-1">Email</h2>
              <p className="text-gray-600">
                <a href="mailto:info@amaravaticommunications.com" className="hover:text-blue-600">info@amaravaticommunications.com</a>
              </p>
              <p className="text-gray-600">
                <a href="mailto:support@adamara.com" className="hover:text-blue-600">support@adamara.com</a> (Support)
              </p>
            </div>
          </div>
        </div>
        
        {/* Key Contacts */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Key Contacts
          </h2>
          
          <div className="space-y-5">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-medium text-gray-800">Rajesh Kumar</h3>
              <p className="text-sm text-blue-600">Chief Executive Officer</p>
              <p className="text-sm text-gray-600">
                <a href="mailto:rajesh.kumar@amaravaticommunications.com" className="hover:text-blue-600">rajesh.kumar@amaravaticommunications.com</a>
              </p>
              <p className="text-sm text-gray-600">
                <a href="tel:+91-9876543210" className="hover:text-blue-600">+91 987 654 3210</a>
              </p>
            </div>
            
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-medium text-gray-800">Priya Sharma</h3>
              <p className="text-sm text-blue-600">Marketing Director</p>
              <p className="text-sm text-gray-600">
                <a href="mailto:priya.sharma@amaravaticommunications.com" className="hover:text-blue-600">priya.sharma@amaravaticommunications.com</a>
              </p>
              <p className="text-sm text-gray-600">
                <a href="tel:+91-9876543211" className="hover:text-blue-600">+91 987 654 3211</a>
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800">Anand Patel</h3>
              <p className="text-sm text-blue-600">Customer Support Manager</p>
              <p className="text-sm text-gray-600">
                <a href="mailto:anand.patel@amaravaticommunications.com" className="hover:text-blue-600">anand.patel@amaravaticommunications.com</a>
              </p>
              <p className="text-sm text-gray-600">
                <a href="tel:+91-9876543212" className="hover:text-blue-600">+91 987 654 3212</a>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Business Hours */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <svg className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Business Hours
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Office Hours</h3>
            <ul className="space-y-1 text-gray-600">
              <li className="flex justify-between">
                <span>Monday - Friday:</span>
                <span>9:00 AM - 6:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday:</span>
                <span>10:00 AM - 2:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday:</span>
                <span>Closed</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Support Hours</h3>
            <ul className="space-y-1 text-gray-600">
              <li className="flex justify-between">
                <span>Monday - Friday:</span>
                <span>8:00 AM - 8:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday:</span>
                <span>9:00 AM - 5:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday:</span>
                <span>Closed</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Map */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Location</h2>
        <div className="h-64 bg-gray-200 rounded-md flex items-center justify-center">
          <p className="text-gray-600">Map will be displayed here</p>
          {/* In a real implementation, you would integrate Google Maps or another map provider here */}
        </div>
        <p className="mt-4 text-gray-600 text-sm">
          Located in the heart of Amaravati Business District, our office is easily accessible from 
          all major transportation routes. Visitor parking is available on the premises.
        </p>
      </div>
    </div>
  );
};

export default ContactUs;