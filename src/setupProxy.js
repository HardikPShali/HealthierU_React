const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    //****** For Local testing */ 
    // app.use('/api/patients', createProxyMiddleware({ target: 'http://localhost:8081' }));
    // app.use('/api/questionnaires', createProxyMiddleware({ target: 'http://localhost:8081' }));
    // app.use('/api/questions', createProxyMiddleware({ target: 'http://localhost:8081' }));
    // app.use('/api/question-answers', createProxyMiddleware({ target: 'http://localhost:8081' }));
    // app.use('/api/account', createProxyMiddleware({ target: 'http://localhost:9999' }));
    // app.use('/oauth/token', createProxyMiddleware({ target: 'http://localhost:9999' }));
    // app.use('/api/register', createProxyMiddleware({ target: 'http://localhost:9999' }));
    // app.use('/api/activate', createProxyMiddleware({ target: 'http://localhost:9999' }));
    // app.use('/api/users', createProxyMiddleware({ target: 'http://localhost:9999' }));
    // app.use('/api/countries', createProxyMiddleware({ target: 'http://localhost:8081' }));
    // app.use('/api/patient', createProxyMiddleware({ target: 'http://localhost:8081' }));
    // app.use('/api/patients/*', createProxyMiddleware({ target: 'http://localhost:8081' }));
    // app.use('/api/admin-documents', createProxyMiddleware({ target: 'http://localhost:8081' }));
    // app.use('/api/admin-upload-document', createProxyMiddleware({ target: 'http://localhost:8081' }));
    // app.use('/api/admin-download', createProxyMiddleware({ target: 'http://localhost:8081' }));
    // app.use('/api/doctors', createProxyMiddleware({ target: 'http://localhost:8081' }));
    // app.use('/api/find-doctor', createProxyMiddleware({ target: 'http://localhost:8081' }))
    // app.use('/api/appointments/filter', createProxyMiddleware({ target: 'http://localhost:8081' }));
    // app.use('/api/appointments', createProxyMiddleware({ target: 'http://localhost:8081' }));
    // app.use('/api/appointments-logs/filter', createProxyMiddleware({ target: 'http://localhost:8081' }));
    // app.use('/api/account/reset-password/finish', createProxyMiddleware({ target: 'http://localhost:9999' }));
    // app.use('/api/account/reset-password/init?accessPlatform=web', createProxyMiddleware({ target: 'http://localhost:9999'}));
    // app.use('/api/doctor-list', createProxyMiddleware({ target: 'http://localhost:8081' }));
    // app.use('/api/patient-list', createProxyMiddleware({ target: 'http://localhost:8081' }));
    // app.use('/api/find-doctor', createProxyMiddleware({ target: 'http://localhost:8081' }));
    // app.use('/api/find-patient', createProxyMiddleware({ target: 'http://localhost:8081' }));
    // app.use('/api/medical-documents', createProxyMiddleware({ target: 'http://localhost:8081' }));
    // app.use('/api/medical-documents/patients/*', createProxyMiddleware({ target: 'http://localhost:8081' }));
    // app.use('/api/medical-documents/doctors/*', createProxyMiddleware({ target: 'http://localhost:8081' }));
    // app.use('/api/medical-document-upload', createProxyMiddleware({ target: 'http://localhost:8081' }));
    // app.use('/api/medical-document-retrival', createProxyMiddleware({ target: 'http://localhost:8081' }));
    // app.use('/api/appointment-logs/filter', createProxyMiddleware({ target: 'http://localhost:8081' }));
    // app.use('/information/information-articles', createProxyMiddleware({ target: 'http://localhost:8081' }));  
    // app.use('/api/paypal/payment', createProxyMiddleware({ target: 'http://localhost:8081' }));  
    // app.use('/api/paypal/success', createProxyMiddleware({ target: 'http://localhost:8081' }));  
    // app.use('/api/doctors', createProxyMiddleware({ target: 'http://localhost:8081' }));
    // app.use('/api/appointments/filter', createProxyMiddleware({ target: 'http://localhost:8081' }));
    // app.use('/api/appointments', createProxyMiddleware({ target: 'http://localhost:8081' }));
    // app.use('/api/appointments-logs/filter', createProxyMiddleware({ target: 'http://localhost:8081' }));
    // app.use('/api/account/reset-password/finish', createProxyMiddleware({ target: 'http://localhost:9999' }));
    // app.use('/api/account/reset-password/init?accessPlatform=web', createProxyMiddleware({ target: 'http://localhost:9999'}));
    // app.use('/api/information-articles', createProxyMiddleware({ target: 'http://localhost:8081' }));
    // app.use('/api/shop-products', createProxyMiddleware({ target: 'http://localhost:8081' }));

    // app.use('/api/call-logs', createProxyMiddleware({ target: 'http://localhost:8081', changeOrigin: true }));
    // app.use('/api/appointments/bulk', createProxyMiddleware({ target: 'https://dev.healthy-u.ae', changeOrigin: true }));    

    // //****** For AWS Services testing */ 
    // app.use('/api/questionnaires', createProxyMiddleware({ target: 'https://dev.healthy-u.ae' }));
    // app.use('/api/question-answers', createProxyMiddleware({ target: 'https://dev.healthy-u.ae' }));
    // app.use('/api/questions', createProxyMiddleware({ target: 'https://dev.healthy-u.ae' }));
    // app.use('/api/account', createProxyMiddleware({ target: 'https://dev.healthy-u.ae', changeOrigin: true }));
    // app.use('/oauth/token', createProxyMiddleware({ target: 'https://dev.healthy-u.ae', changeOrigin: true }));
    // app.use('/api/register', createProxyMiddleware({ target: 'https://dev.healthy-u.ae', changeOrigin: true  }));
    // app.use('/api/activate', createProxyMiddleware({ target: 'https://dev.healthy-u.ae', changeOrigin: true  }));
    // app.use('/api/users', createProxyMiddleware({ target: 'https://dev.healthy-u.ae', changeOrigin: true  }));
    // app.use('/api/countries', createProxyMiddleware({ target: 'https://dev.healthy-u.ae', changeOrigin: true  }));
    // app.use('/api/patient', createProxyMiddleware({ target: 'https://dev.healthy-u.ae', changeOrigin: true  }));
    // app.use('/api/admin/patients', createProxyMiddleware({ target: 'https://dev.healthy-u.ae', changeOrigin: true  }));
    // app.use('/api/admin/doctors', createProxyMiddleware({ target: 'https://dev.healthy-u.ae', changeOrigin: true  }));
    // app.use('/api/appointments/filter', createProxyMiddleware({ target: 'https://dev.healthy-u.ae', changeOrigin: true }));
    // app.use('/api/appointments', createProxyMiddleware({ target: 'https://dev.healthy-u.ae', changeOrigin: true }));
    // app.use('/api/appointment-logs/filter', createProxyMiddleware({ target: 'https://dev.healthy-u.ae', changeOrigin: true }));
    // app.use('/api/account/reset-password/finish', createProxyMiddleware({ target: 'https://dev.healthy-u.ae', changeOrigin: true }));
    // app.use('/api/account/reset-password/init?accessPlatform=web', createProxyMiddleware({ target: 'https://dev.healthy-u.ae', changeOrigin: true }));
    // app.use('/api/specialities/all', createProxyMiddleware({ target: 'https://dev.healthy-u.ae', changeOrigin: true }));
    // app.use('/api/appointments/invalid', createProxyMiddleware({ target: 'https://dev.healthy-u.ae', changeOrigin: true  }));
    // app.use('/api/languages', createProxyMiddleware({ target: 'https://dev.healthy-u.ae' , changeOrigin: true}));
    // app.use('/api/doctors/picture/', createProxyMiddleware({ target: 'https://dev.healthy-u.ae' }));
    // app.use('/api/patient/picture/', createProxyMiddleware({ target: 'https://dev.healthy-u.ae' }));
    // app.use('/api/medical-documents', createProxyMiddleware({ target: 'https://dev.healthy-u.ae' }));
    // app.use('/api/medical-documents/patients/*', createProxyMiddleware({ target: 'https://dev.healthy-u.ae' }));
    // app.use('/api/medical-document-upload', createProxyMiddleware({ target: 'https://dev.healthy-u.ae' }));
    // app.use('/api/medical-document-retrival', createProxyMiddleware({ target: 'https://dev.healthy-u.ae' }));
    // app.use('/api/find-doctor/*', createProxyMiddleware({ target: 'https://dev.healthy-u.ae', changeOrigin: true }));
    // app.use('/api/find-patients', createProxyMiddleware({ target: 'https://dev.healthy-u.ae', changeOrigin: true }));
    // app.use('/api/medical-documents/doctors/*', createProxyMiddleware({ target: 'https://dev.healthy-u.ae' }));
    // app.use('/api/mobile-questionnaires?category=Patient&patientid=', createProxyMiddleware({ target: 'https://dev.healthy-u.ae' }));
    // app.use('/api/mobile-questionnaires', createProxyMiddleware({ target: 'https://dev.healthy-u.ae' }));
    // app.use('/api/appointments/active-past', createProxyMiddleware({ target: 'https://dev.healthy-u.ae', changeOrigin: true }));
    // app.use('/oauth/google', createProxyMiddleware({ target: 'https://dev.healthy-u.ae', changeOrigin: true }));
    // app.use('/oauth/agora', createProxyMiddleware({ target: 'https://dev.healthy-u.ae', changeOrigin: true }));
    // app.use('/api/like-logs', createProxyMiddleware({ target: 'https://dev.healthy-u.ae', changeOrigin: true }));
    // app.use('/api/paypal/payment', createProxyMiddleware({ target: 'https://dev.healthy-u.ae' , changeOrigin: true }));  
    // app.use('/api/paypal/success', createProxyMiddleware({ target: 'https://dev.healthy-u.ae', changeOrigin: true  }));  
    // app.use('/information/information-articles', createProxyMiddleware({ target: 'https://dev.healthy-u.ae' ,changeOrigin: true})); 
    // app.use('/api/information/information-articles', createProxyMiddleware({ target: 'https://dev.healthy-u.ae' ,changeOrigin: true}));
    // app.use('/api/information-articles', createProxyMiddleware({ target: 'https://dev.healthy-u.ae' ,changeOrigin: true}));
    // app.use('/api/admin/workouts', createProxyMiddleware({ target: 'https://dev.healthy-u.ae', changeOrigin: true })); 
    // app.use('/api/admin/workout-categories', createProxyMiddleware({ target: 'https://dev.healthy-u.ae', changeOrigin: true })); 
    // app.use('/api/shop-products', createProxyMiddleware({ target: 'https://dev.healthy-u.ae', changeOrigin: true }));
    // app.use('/api/call-logs', createProxyMiddleware({ target: 'https://dev.healthy-u.ae', changeOrigin: true }));
    // app.use('/api/appointments/bulk', createProxyMiddleware({ target: 'https://dev.healthy-u.ae', changeOrigin: true }));    
    //****** For AWS Services testing */ 
    const DEV_CLOUD = "https://api-healthieru.devtomaster.com";
    //const PROD_CLOUD = "https://biogenix.ae/";

    app.use(
        "/api",
        createProxyMiddleware({
            // target: LOCAL_IP,
            target: DEV_CLOUD,
            //target: PROD_CLOUD,
            // target: UAT_CLOUD,
            changeOrigin: true,
            secure: true,
        })
    );
    app.use(
        "/oauth",
        createProxyMiddleware({
            // target: LOCAL_IP,
            target: DEV_CLOUD,
            //target: PROD_CLOUD,
            // target: UAT_CLOUD,
            changeOrigin: true,
            secure: true,
        })
    );
};
