import { lazy } from 'react';
const Clinics = lazy(() => import('../pages/Clinics'));
const Physicians = lazy(() => import('../pages/Physicians'));
const AddPhysicians = lazy(() => import('../pages/Clinics/PhysicianInfo'));
const ClinicInfo = lazy(() => import('../pages/Clinics/ClinicInfo'));
const ClinicEdit = lazy(() => import('../pages/Clinics/ClinicEdit'));
const ClinicDetails = lazy(() => import('../pages/ClinicDetails'));
const ChangePassword = lazy(() => import('../pages/ChangePassword'));
const Settings = lazy(() => import('../pages/ Settings'));

const EmailUploadImg = lazy(() => import('../pages/EmailUploadImg'));
const Invoice = lazy(() => import('../pages/Invoice'));
const WebsiteLeads = lazy(() => import('../pages/WebsiteLeads'));

export const adminRoutes = [
    { path: '/clinics', Component: Clinics, title: "Clinics" },
    { path: '/physicians', Component: Physicians, title: "Physicians" },
    { path: '/add-clinic', Component: ClinicInfo, title: "Add Clinic" },
    { path: '/add-physician', Component: AddPhysicians, title: "Add Physician" },
    { path: '/clinic-detail/:id', Component: ClinicDetails, title: "Clinic detail" },
    { path: '/clinic/:id', Component: ClinicEdit, title: "Edit Clinic" },
    { path: '/change-password', Component: ChangePassword, title: "ChangePassword" },
    { path: '/invoice/:id', Component: Invoice, title: "Invoice" },
    { path: '/website-leads', Component: WebsiteLeads, title: "WebsiteLeads" },
    { path: '/Settings', Component: Settings, title: "Settings" },
    // { path: '/email-img', Component: EmailUploadImg, title: "upload image" },

];
