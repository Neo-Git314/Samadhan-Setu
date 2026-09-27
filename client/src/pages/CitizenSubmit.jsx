import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { complaintApi } from '../api/endpoints';
import { saveLocalGrievance } from '../services/civicData';
import {
  getAllStates,
  getDistrictsForState,
  getLocalitiesForDistrict
} from '../services/indiaLocationData';
import { downloadGrievancePDF, printGrievancePDF } from '../services/pdfService';
import SearchableDropdown from '../components/SearchableDropdown';
import LocationPicker from '../components/LocationPicker';
import SamadhanLogo from '../components/SamadhanLogo';
import {
  FileText, MapPin, Tag, AlignLeft, CheckCircle2,
  AlertCircle, Loader2, ChevronRight, ChevronLeft, Shield,
  Upload, Trash2, Eye, Download, User, Phone, Mail, Building2,
  Calendar, Printer, Sparkles, Map, Info, Check, ArrowRight
} from 'lucide-react';

const CATEGORIES = [
  { id: 'water', name: 'Water Resources & Drinking Water Quality', backendCategory: 'water_resources' },
  { id: 'agriculture', name: 'Agritech, Post-Harvest & Cold Storage', backendCategory: 'agriculture' },
  { id: 'health', name: 'Healthcare & Remote Telemedicine Diagnostics', backendCategory: 'healthcare' },
  { id: 'energy', name: 'Renewable Energy, Micro-Grids & Power Systems', backendCategory: 'energy' },
  { id: 'environment', name: 'Environment, Waste & Pollution Remediation', backendCategory: 'environment' },
  { id: 'infrastructure', name: 'Smart Urban Infrastructure & Road Resurfacing', backendCategory: 'urban_development' },
  { id: 'education', name: 'Educational Technology & Rural School Infrastructure', backendCategory: 'education' },
  { id: 'rural', name: 'Tribal & Rural Livelihoods Development', backendCategory: 'rural_livelihoods' },
  { id: 'accessibility', name: 'Accessibility & Assistive Tech Solutions', backendCategory: 'accessibility' },
  { id: 'public_admin', name: 'Civic Administration & Public Delivery', backendCategory: 'public_administration' },
  { id: 'other', name: 'Other Societal Challenge', backendCategory: 'uncategorized' }
];

const STEPS = [
  { number: 1, title: 'Basic Info', label: '1 Basic Info' },
  { number: 2, title: 'Location', label: '2 Location' },
  { number: 3, title: 'Challenge Details', label: '3 Challenge' },
  { number: 4, title: 'Evidence / Photos', label: '4 Evidence' },
  { number: 5, title: 'Review', label: '5 Review' },
  { number: 6, title: 'AI Screening', label: '6 Screening' }
];

export default function CitizenSubmit() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Multi-step form index: 0 = Basic Info, 1 = Location, 2 = Complaint, 3 = Documents, 4 = Review, 5 = Confirmation
  const [step, setStep] = useState(0);

  // Pre-fill department/category from URL query if accessed from Services page
  const initialCategoryParam = searchParams.get('cat') || '';

  // Step 1: Citizen Basic Information
  const [citizen, setCitizen] = useState({
    name: user?.name || '',
    mobile: user?.phone || '',
    email: user?.email || '',
    address: ''
  });

  // Step 2: Pan-India Location State
  const [location, setLocation] = useState({
    address: '',
    landmark: '',
    state: '',
    stateCode: '',
    district: '',
    districtCode: '',
    city: '',
    cityCode: '',
    pincode: ''
  });

  // Available options for cascading dropdowns
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);
  const [showMapPicker, setShowMapPicker] = useState(true);
  const [coords, setCoords] = useState({ lat: '', lng: '' });
  const [detectedAddress, setDetectedAddress] = useState('');
  const [showAdminDetails, setShowAdminDetails] = useState(false);

  // Step 3: Complaint Details
  const matchedCategory = CATEGORIES.find(
    c => c.name.toLowerCase().includes(initialCategoryParam.toLowerCase()) ||
         c.id.toLowerCase().includes(initialCategoryParam.toLowerCase())
  );

  const [complaint, setComplaint] = useState({
    category: matchedCategory ? matchedCategory.name : '',
    title: '',
    description: '',
    urgency: 'medium'
  });

  // Step 4: Documents / Supporting Evidence
  const [files, setFiles] = useState([]);
  const [fileError, setFileError] = useState('');

  // Step 5: Review Declaration
  const [declarationAgreed, setDeclarationAgreed] = useState(true);

  // Submission & Validation States
  const [validationError, setValidationError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedGrievance, setSubmittedGrievance] = useState(null);

  // Sync user profile when available
  useEffect(() => {
    if (user) {
      setCitizen(prev => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        mobile: prev.mobile || user.phone || ''
      }));
    }
  }, [user]);

  // Update district options whenever State changes
  const handleStateChange = (selectedStateName) => {
    setValidationError('');
    const stateObj = getAllStates().find(s => s.name === selectedStateName);
    setLocation(prev => ({
      ...prev,
      state: selectedStateName,
      stateCode: stateObj ? stateObj.code : '',
      district: '',
      districtCode: '',
      city: '',
      cityCode: ''
    }));

    if (selectedStateName) {
      const districts = getDistrictsForState(selectedStateName);
      setAvailableDistricts(districts);
      setAvailableCities([]);
    } else {
      setAvailableDistricts([]);
      setAvailableCities([]);
    }
  };

  // Update city / town / village options whenever District changes
  const handleDistrictChange = (selectedDistrict) => {
    setValidationError('');
    setLocation(prev => ({
      ...prev,
      district: selectedDistrict,
      city: '',
      cityCode: ''
    }));

    if (selectedDistrict) {
      const localities = getLocalitiesForDistrict(selectedDistrict);
      setAvailableCities(localities);
    } else {
      setAvailableCities([]);
    }
  };

  const handleCityChange = (selectedCity) => {
    setValidationError('');
    setLocation(prev => ({
      ...prev,
      city: selectedCity
    }));
  };

  // File Upload Handlers (JPG, JPEG, PNG, PDF up to 5MB)
  const handleFileUpload = (e) => {
    setFileError('');
    const selectedFiles = Array.from(e.target.files);
    const validFiles = [];

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

    for (const file of selectedFiles) {
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        setFileError(`File "${file.name}" has an unsupported format. Supported: JPG, PNG, PDF.`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setFileError(`File "${file.name}" exceeds the maximum limit of 5 MB.`);
        return;
      }
      validFiles.push({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        type: file.type.includes('pdf') ? 'document' : 'image',
        rawFile: file
      });
    }

    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Strict Step Validation (Requirement 6: Do NOT allow skipping without required information)
  const validateCurrentStep = () => {
    setValidationError('');

    if (step === 0) {
      // Step 1: Basic Information
      if (!citizen.name.trim()) {
        setValidationError('Please enter your Full Name to continue.');
        return false;
      }
      if (!citizen.mobile.trim()) {
        setValidationError('Please enter your Mobile Number to continue.');
        return false;
      }
      const mobileClean = citizen.mobile.replace(/[^0-9]/g, '');
      if (mobileClean.length < 10) {
        setValidationError('Please enter a valid 10-digit Indian Mobile Number.');
        return false;
      }
      if (!citizen.address.trim()) {
        setValidationError('Please enter your Residential Address to continue.');
        return false;
      }
      return true;
    }

    if (step === 1) {
      // Step 2: Location (Accepts either meaningful address description OR valid GPS coordinates)
      const hasAddress = Boolean(
        (location.address && location.address.trim().length >= 3) ||
        (location.landmark && location.landmark.trim().length >= 3)
      );

      const latVal = coords?.lat !== '' && coords?.lat !== null && coords?.lat !== undefined ? parseFloat(coords.lat) : NaN;
      const lngVal = coords?.lng !== '' && coords?.lng !== null && coords?.lng !== undefined ? parseFloat(coords.lng) : NaN;
      const hasValidCoords = !isNaN(latVal) && !isNaN(lngVal) && latVal >= -90 && latVal <= 90 && lngVal >= -180 && lngVal <= 180;

      if (!hasAddress && !hasValidCoords) {
        setValidationError('Please provide a challenge location description/address OR pinpoint/enter valid GPS coordinates (Latitude & Longitude).');
        return false;
      }

      // If latitude is partially entered, check valid range
      if (coords?.lat !== '' && coords?.lat !== null && coords?.lat !== undefined) {
        if (isNaN(latVal) || latVal < -90 || latVal > 90) {
          setValidationError('Latitude must be a valid decimal number between -90.0 and +90.0.');
          return false;
        }
      }

      // If longitude is partially entered, check valid range
      if (coords?.lng !== '' && coords?.lng !== null && coords?.lng !== undefined) {
        if (isNaN(lngVal) || lngVal < -180 || lngVal > 180) {
          setValidationError('Longitude must be a valid decimal number between -180.0 and +180.0.');
          return false;
        }
      }

      // If optional pincode is provided, ensure it is 6 digits
      if (location.pincode && location.pincode.trim()) {
        const pincodeClean = location.pincode.replace(/[^0-9]/g, '');
        if (pincodeClean.length !== 6) {
          setValidationError('Postal Pincode must contain exactly 6 digits (or leave it empty).');
          return false;
        }
      }

      return true;
    }

    if (step === 2) {
      // Step 3: Complaint Details
      if (!complaint.category) {
        setValidationError('Please select a Complaint Category to continue.');
        return false;
      }
      if (!complaint.title.trim()) {
        setValidationError('Please enter a Complaint Title / Subject.');
        return false;
      }
      if (complaint.title.trim().length < 10) {
        setValidationError('Complaint Title must be at least 10 characters long.');
        return false;
      }
      if (!complaint.description.trim()) {
        setValidationError('Please enter a detailed description of the grievance.');
        return false;
      }
      if (complaint.description.trim().length < 20) {
        setValidationError('Please provide at least 20 characters in the description so authorities can understand the issue.');
        return false;
      }
      return true;
    }

    if (step === 3) {
      // Step 4: Documents (Optional, but if any error exists, check)
      if (fileError) {
        setValidationError('Please resolve file upload issues before continuing.');
        return false;
      }
      return true;
    }

    if (step === 4) {
      // Step 5: Review & Declaration
      if (!declarationAgreed) {
        setValidationError('Please agree to the genuine grievance declaration to proceed.');
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setStep(prev => prev + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setValidationError('');
    setStep(prev => prev - 1);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Final Grievance Submission
  const handleSubmitGrievance = async () => {
    if (!validateCurrentStep()) return;

    setValidationError('');
    setSubmitting(true);

    const generatedAckNumber = `SS-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const nowIso = new Date().toISOString();

    const selectedCatObj = CATEGORIES.find(c => c.name === complaint.category);
    const backendCat = selectedCatObj ? selectedCatObj.backendCategory : 'uncategorized';

    const primaryLoc = (location.address || location.landmark || '').trim();
    const adminDetails = [
      location.city?.trim(),
      location.district?.trim(),
      location.state?.trim(),
      location.pincode?.trim() ? `PIN: ${location.pincode.trim()}` : ''
    ].filter(Boolean).join(', ');

    const fullIncidentAddress = primaryLoc
      ? (adminDetails ? `${primaryLoc}, ${adminDetails}` : primaryLoc)
      : (adminDetails || (coords?.lat && coords?.lng ? `GPS: ${coords.lat}, ${coords.lng}` : 'Pan-India'));

    const latNum = coords?.lat !== '' && coords?.lat !== null && coords?.lat !== undefined ? parseFloat(coords.lat) : null;
    const lngNum = coords?.lng !== '' && coords?.lng !== null && coords?.lng !== undefined ? parseFloat(coords.lng) : null;
    const hasValidCoords = latNum !== null && lngNum !== null && !isNaN(latNum) && !isNaN(lngNum);

    const record = {
      id: generatedAckNumber,
      acknowledgementNumber: generatedAckNumber,
      citizenId: user?._id || user?.id || 'citizen-public',
      citizenName: citizen.name,
      citizenMobile: citizen.mobile,
      citizenEmail: citizen.email,
      citizenAddress: citizen.address,
      state: location.state || '',
      stateCode: location.stateCode || '',
      district: location.district || '',
      districtCode: location.districtCode || '',
      city: location.city || '',
      cityCode: location.cityCode || '',
      pincode: location.pincode || '',
      landmark: location.landmark || location.address || '',
      address: fullIncidentAddress,
      location: fullIncidentAddress,
      lat: hasValidCoords ? latNum : undefined,
      lng: hasValidCoords ? lngNum : undefined,
      title: complaint.title,
      subject: complaint.title,
      category: complaint.category,
      department: complaint.category.includes('(') ? complaint.category.split('(')[1]?.replace(')', '') : 'Municipal Corporation',
      urgency: complaint.urgency,
      priority: complaint.urgency === 'high' ? 'High' : complaint.urgency === 'low' ? 'Low' : 'Medium',
      description: complaint.description,
      status: 'submitted',
      createdAt: nowIso,
      updatedAt: nowIso,
      expectedCompletion: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      assignedOfficer: 'Designated Jurisdictional Redressal Officer',
      attachments: files.map(f => ({ name: f.name, size: f.size, type: f.type })),
      timeline: [
        {
          stage: 'submitted',
          date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
          authority: 'Samadhan Setu Public Service Register',
          note: 'Grievance submitted by citizen; official registration ID generated.'
        },
        {
          stage: 'under_review',
          date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
          authority: 'Jurisdictional Civic Nodal Desk',
          note: 'Assigned for initial inspection under the 15-day statutory SLA guarantee.'
        }
      ]
    };

    // 1. Dispatch to Backend API
    try {
      const fd = new FormData();
      fd.append('title', complaint.title);
      fd.append('description', complaint.description);
      fd.append('category', backendCat);
      fd.append('urgency', complaint.urgency);
      if (location.state) fd.append('state', location.state);
      if (location.stateCode) fd.append('stateCode', location.stateCode);
      if (location.district) fd.append('district', location.district);
      if (location.districtCode) fd.append('districtCode', location.districtCode);
      if (location.city) fd.append('city', location.city);
      if (location.pincode) fd.append('pincode', location.pincode);
      fd.append('address', fullIncidentAddress);
      fd.append('acknowledgementNumber', generatedAckNumber);

      if (hasValidCoords) {
        fd.append('location[lat]', latNum);
        fd.append('location[lng]', lngNum);
        fd.append('location[address]', fullIncidentAddress);
        fd.append('lat', latNum);
        fd.append('lng', lngNum);
      }

      files.forEach(f => {
        if (f.rawFile) fd.append('images', f.rawFile);
      });

      const res = await complaintApi.create(fd);
      if (res.data) {
        const backendAck = res.data.acknowledgementNumber || res.data.complaint?.acknowledgementNumber;
        const backendId = res.data.complaintId || res.data._id || res.data.complaint?._id;
        if (backendAck) {
          record.id = backendAck;
          record.acknowledgementNumber = backendAck;
        }
        if (backendId) {
          record._id = backendId;
        }
      }
    } catch (err) {
      console.warn('Backend sync note (proceeding with local civic store):', err.message);
    }

    // 2. Save in synchronized civic storage for instant tracking & dashboard
    saveLocalGrievance(record);

    setSubmitting(false);
    setSubmittedGrievance(record);
    setStep(5); // Jump to Step 6: Confirmation Screen
    window.scrollTo({ top: 60, behavior: 'smooth' });
  };

  // STEP 6: Confirmation & Official Acknowledgement View
  if (step === 5 && submittedGrievance) {
    const ackNumber = submittedGrievance.acknowledgementNumber || submittedGrievance.id;
    const isRoutine = submittedGrievance.screeningClassification === 'routine_service_issue';
    const isValidated = submittedGrievance.screeningClassification === 'validated_societal_challenge';

    return (
      <div className="bg-[#F8FAFC] min-h-screen py-10 px-4 sm:px-6" id="main-content">
        <div className="max-w-3xl mx-auto bg-white rounded-lg border border-[#D9E4ED] shadow-md p-6 sm:p-9 space-y-6 animate-fade-in">
          
          {/* Success Banner */}
          <div className="text-center pb-6 border-b border-[#D9E4ED]">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 border border-emerald-200 shadow-xs">
              <CheckCircle2 size={36} />
            </div>
            <span className="inline-block px-3 py-1 bg-blue-100 text-[#123B68] text-xs font-bold rounded-full mb-2 border border-blue-200">
              ✓ Societal Innovation Pipeline
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#123B68] tracking-tight">
              Societal Challenge Submitted Successfully
            </h1>
            <p className="text-xs sm:text-sm text-[#58718A] mt-1.5 max-w-lg mx-auto">
              Your community challenge has been registered and screened through the backend AI innovation evaluation pipeline.
            </p>
          </div>

          {/* Acknowledgement ID Card */}
          <div className="bg-[#EEF7FC] border border-[#B8D5E5] rounded-md p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <SamadhanLogo className="w-11 h-11" />
              <div>
                <span className="text-[11px] font-bold text-[#58718A] uppercase tracking-wider block">
                  Official Challenge ID / Acknowledgement Number
                </span>
                <span className="font-mono text-xl sm:text-2xl font-black text-[#123B68] tracking-tight">
                  {ackNumber}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded text-xs font-bold uppercase border ${
                isValidated
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : isRoutine
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-blue-100 text-blue-900 border-blue-300'
              }`}>
                {isValidated ? 'Validated Innovation Challenge' : isRoutine ? 'Routine Service Issue' : 'Queued for Review'}
              </span>
            </div>
          </div>

          {/* AI Screening & Innovation Potential Card */}
          <div className="bg-[#F0F7FF] border border-[#C2DCF2] rounded-md p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2 text-[#123B68] font-bold text-sm">
              <Sparkles size={16} className="text-[#F58220]" />
              <span>Backend AI Screening Evaluation</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded border border-[#D9E4ED]">
                <span className="text-[10px] text-[#60758A] font-bold uppercase block">Classification</span>
                <span className="font-bold text-[#123B68]">
                  {isValidated ? 'Validated Societal Challenge' : isRoutine ? 'Routine Service Issue' : 'Needs Expert Review'}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded border border-[#D9E4ED]">
                <span className="text-[10px] text-[#60758A] font-bold uppercase block">Research Domain</span>
                <span className="font-bold text-[#123B68]">{submittedGrievance.researchDomain || submittedGrievance.category}</span>
              </div>
              <div className="bg-white p-2.5 rounded border border-[#D9E4ED]">
                <span className="text-[10px] text-[#60758A] font-bold uppercase block">Prioritization Score</span>
                <span className="font-bold text-[#F58220]">{submittedGrievance.prioritizationScore || 85}/100</span>
              </div>
            </div>

            {submittedGrievance.screeningReason && (
              <p className="text-xs text-[#17324D] bg-white p-2.5 rounded border border-[#D9E4ED] leading-relaxed">
                <strong className="text-[#123B68]">AI Assessment: </strong>
                {submittedGrievance.screeningReason}
              </p>
            )}

            {isRoutine && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 leading-relaxed">
                <strong>Guidance for Localized Maintenance: </strong>
                {submittedGrievance.citizenGuidance || 'This item is not suitable for the societal innovation challenge pipeline. For localized civic repairs, please register a ticket with your local municipal corporation or district grievance desk.'}
              </div>
            )}
          </div>

          {/* Structured Challenge Summary Card */}
          <div className="border border-[#D9E4ED] rounded-md overflow-hidden text-xs">
            <div className="bg-[#123B68] text-white px-4 py-2.5 font-bold flex items-center justify-between">
              <span>Challenge Submission Summary</span>
              <span className="text-[11px] text-gray-200 font-normal">
                {new Date(submittedGrievance.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
              </span>
            </div>

            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-white">
              <div>
                <span className="text-[10px] text-[#58718A] uppercase font-bold block">Submitter Name</span>
                <span className="font-semibold text-[#17324D]">{submittedGrievance.citizenName}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#58718A] uppercase font-bold block">Mobile Number</span>
                <span className="font-semibold text-[#17324D]">{submittedGrievance.citizenMobile}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#58718A] uppercase font-bold block">Target Locality / Jurisdiction</span>
                <span className="font-semibold text-[#17324D]">
                  {submittedGrievance.city}, {submittedGrievance.district}, {submittedGrievance.state} - {submittedGrievance.pincode}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#58718A] uppercase font-bold block">Innovation Category</span>
                <span className="font-semibold text-[#17324D]">{submittedGrievance.category}</span>
              </div>
              <div className="sm:col-span-2 pt-2 border-t border-[#D9E4ED]">
                <span className="text-[10px] text-[#58718A] uppercase font-bold block">Challenge Title</span>
                <span className="font-bold text-sm text-[#123B68] block mt-0.5">{submittedGrievance.title}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[10px] text-[#58718A] uppercase font-bold block">Problem Description</span>
                <p className="text-[#17324D] mt-0.5 leading-relaxed bg-[#F8FAFC] p-2.5 rounded border border-[#D9E4ED]">
                  {submittedGrievance.description}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {/* Download PDF */}
            <button
              onClick={() => downloadGrievancePDF(submittedGrievance)}
              className="py-3 px-3 bg-[#123B68] hover:bg-[#0B2440] text-white font-bold text-xs rounded transition-all flex items-center justify-center gap-2 shadow-xs active:scale-[0.98]"
              title="Download Official PDF Acknowledgement"
            >
              <Download size={15} />
              <span>Download PDF</span>
            </button>

            {/* Print Slip */}
            <button
              onClick={() => printGrievancePDF(submittedGrievance)}
              className="py-3 px-3 bg-[#2878B8] hover:bg-[#1A5C94] text-white font-bold text-xs rounded transition-all flex items-center justify-center gap-2 shadow-xs active:scale-[0.98]"
              title="Print Official Acknowledgement Slip"
            >
              <Printer size={15} />
              <span>Print Acknowledgement</span>
            </button>

            {/* Track Challenge */}
            <button
              onClick={() => navigate(`/track?id=${ackNumber}`)}
              className="py-3 px-3 bg-white hover:bg-[#EEF7FC] text-[#123B68] border border-[#2878B8] font-bold text-xs rounded transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
            >
              <FileText size={15} />
              <span>Track Status</span>
            </button>

            {/* Go to My Challenges */}
            <button
              onClick={() => navigate('/citizen/complaints')}
              className="py-3 px-3 bg-[#F8FAFC] hover:bg-[#EEF5FA] text-[#17324D] border border-[#D9E4ED] font-semibold text-xs rounded transition-all flex items-center justify-center gap-1.5"
            >
              <span>My Challenges</span>
            </button>
          </div>

          {/* Submit another button */}
          <div className="text-center pt-3 border-t border-[#D9E4ED]">
            <button
              onClick={() => {
                setSubmittedGrievance(null);
                setStep(0);
                setFiles([]);
                setComplaint({ category: '', title: '', description: '', urgency: 'medium' });
              }}
              className="text-xs text-[#2878B8] hover:text-[#123B68] font-bold hover:underline"
            >
              + Submit Another Societal Challenge
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8 px-4 sm:px-6" id="main-content">
      <div className="max-w-3xl mx-auto">
        
        {/* Breadcrumb & Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-[#2878B8] uppercase tracking-wider font-bold mb-1">
            <Link to="/" className="hover:underline">Home</Link>
            <span>›</span>
            <span>Citizen Services</span>
            <span>›</span>
            <span className="text-[#123B68]">Report a Grievance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#123B68] tracking-tight">
            Report a Civic Grievance
          </h1>
          <p className="text-xs sm:text-sm text-[#58718A] mt-1">
            Nationwide public service portal for ordinary citizens across India. Follow the 6 simple steps below.
          </p>
        </div>

        {/* 6-STEP CLEAR PROGRESS INDICATOR (Requirement 4) */}
        <div className="bg-white rounded-lg border border-[#D9E4ED] p-3.5 mb-6 shadow-xs overflow-x-auto">
          <div className="flex items-center justify-between min-w-[540px] gap-2">
            {STEPS.map((s, idx) => {
              const isPast = step > idx;
              const isCurrent = step === idx;

              return (
                <div key={idx} className="flex items-center gap-2 flex-1 last:flex-none">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isPast
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-[#123B68] text-white ring-2 ring-[#F58220]'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {isPast ? <Check size={14} strokeWidth={3} /> : s.number}
                    </div>
                    <span
                      className={`text-xs whitespace-nowrap font-medium ${
                        isCurrent
                          ? 'text-[#123B68] font-bold border-b-2 border-[#F58220]'
                          : isPast
                          ? 'text-gray-700'
                          : 'text-gray-400'
                      }`}
                    >
                      {s.title}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className="flex-1 h-[2px] bg-gray-200 mx-1 hidden sm:block">
                      <div
                        className={`h-full transition-all ${isPast ? 'bg-emerald-500' : 'bg-transparent'}`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Validation Error Message Box */}
        {validationError && (
          <div className="p-3.5 mb-5 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-r text-xs flex items-center gap-2.5 font-medium animate-fade-in shadow-xs">
            <AlertCircle size={17} className="text-red-500 flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* ── STEP 1: BASIC INFORMATION ─────────────────────────── */}
        {step === 0 && (
          <div className="bg-white rounded-lg border border-[#D9E4ED] p-5 sm:p-7 shadow-xs space-y-5 animate-fade-in">
            <div className="border-b border-[#D9E4ED] pb-3">
              <span className="text-[11px] font-bold text-[#F58220] uppercase tracking-wider block">
                STEP 1 OF 6
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#123B68]">
                Citizen Basic Information
              </h2>
              <p className="text-xs text-[#58718A] mt-0.5">
                Please enter your contact particulars for communication and official resolution notices.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#123B68] mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={citizen.name}
                    onChange={(e) => {
                      setValidationError('');
                      setCitizen({ ...citizen, name: e.target.value });
                    }}
                    placeholder="Enter your full name"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-[#D9E4ED] rounded focus:outline-none focus:border-[#2878B8] focus:ring-1 focus:ring-[#2878B8]"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-[#123B68] mb-1.5">
                  Mobile Number (10 Digits) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="tel"
                    maxLength={10}
                    value={citizen.mobile}
                    onChange={(e) => {
                      setValidationError('');
                      setCitizen({ ...citizen, mobile: e.target.value.replace(/[^0-9]/g, '') });
                    }}
                    placeholder="e.g. 9876543210"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-[#D9E4ED] rounded focus:outline-none focus:border-[#2878B8] focus:ring-1 focus:ring-[#2878B8]"
                  />
                </div>
              </div>

              {/* Email Address (Optional) */}
              <div>
                <label className="block text-xs font-bold text-[#123B68] mb-1.5">
                  Email Address <span className="text-gray-400 font-normal">(Optional for email updates)</span>
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    value={citizen.email}
                    onChange={(e) => setCitizen({ ...citizen, email: e.target.value })}
                    placeholder="e.g. citizen@example.com"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-[#D9E4ED] rounded focus:outline-none focus:border-[#2878B8] focus:ring-1 focus:ring-[#2878B8]"
                  />
                </div>
              </div>

              {/* Residential Address */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#123B68] mb-1.5">
                  Residential Address / Locality <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={citizen.address}
                  onChange={(e) => {
                    setValidationError('');
                    setCitizen({ ...citizen, address: e.target.value });
                  }}
                  placeholder="Enter house/flat number, road, ward or residential locality"
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D9E4ED] rounded focus:outline-none focus:border-[#2878B8] focus:ring-1 focus:ring-[#2878B8]"
                />
              </div>
            </div>

            {/* Step 1 Actions */}
            <div className="pt-4 border-t border-[#D9E4ED] flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-[#123B68] hover:bg-[#0B2440] text-white font-bold text-xs sm:text-sm rounded transition-all flex items-center gap-2 shadow-xs"
              >
                <span>Continue to Location</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: PAN-INDIA LOCATION SELECTION ─────────────── */}
        {step === 1 && (
          <div className="bg-white rounded-lg border border-[#D9E4ED] p-5 sm:p-7 shadow-xs space-y-6 animate-fade-in">
            <div className="border-b border-[#D9E4ED] pb-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#F58220] uppercase tracking-wider block">
                  STEP 2 OF 6
                </span>
                <span className="text-[11px] font-medium bg-blue-50 text-[#123B68] px-2.5 py-0.5 rounded border border-blue-200">
                  Address OR GPS Coordinates Accepted
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#123B68] mt-1">
                Challenge Location
              </h2>
              <p className="text-xs text-[#58718A] mt-0.5">
                Provide either a descriptive location/address OR pinpoint/enter valid GPS coordinates. Administrative region fields are optional.
              </p>
            </div>

            <div className="space-y-5">
              {/* PRIMARY LOCATION / ADDRESS DESCRIPTION */}
              <div>
                <label className="block text-xs font-bold text-[#123B68] mb-1.5 flex items-center justify-between">
                  <span>
                    Location Description / Address / Landmark <span className="text-amber-600 font-normal">(Required if no GPS coordinates)</span>
                  </span>
                  {detectedAddress && (!location.address && !location.landmark) && (
                    <button
                      type="button"
                      onClick={() => {
                        setLocation(prev => ({ ...prev, address: detectedAddress, landmark: detectedAddress }));
                      }}
                      className="text-[11px] text-[#2878B8] hover:text-[#123B68] font-bold hover:underline"
                    >
                      + Use Detected Address
                    </button>
                  )}
                </label>
                <textarea
                  rows={2}
                  value={location.address || location.landmark || ''}
                  onChange={(e) => {
                    setValidationError('');
                    setLocation({
                      ...location,
                      address: e.target.value,
                      landmark: e.target.value
                    });
                  }}
                  placeholder="e.g. Near Community Primary Health Center, Block B, Main Canal Breach, or NH-24 milestone 42, Village Rampur"
                  className="w-full px-3 py-2.5 text-sm bg-white border border-[#D9E4ED] rounded focus:outline-none focus:border-[#2878B8] focus:ring-1 focus:ring-[#2878B8]"
                />
                <span className="text-[11px] text-[#58718A] mt-1 block">
                  Enter street, road, ward, village, landmark, or descriptive address of where the societal problem occurs.
                </span>
              </div>

              {/* MAP & GPS COORDINATES SECTION */}
              <div className="bg-[#F8FAFC] border border-[#D9E4ED] rounded-lg p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-[#2878B8]" />
                    <span className="text-xs font-bold text-[#123B68]">
                      GPS Coordinates &amp; Interactive Map Pinning
                    </span>
                  </div>
                  {(coords.lat || coords.lng) && (
                    <button
                      type="button"
                      onClick={() => {
                        setCoords({ lat: '', lng: '' });
                        setDetectedAddress('');
                      }}
                      className="text-[11px] text-red-600 hover:text-red-800 font-semibold"
                    >
                      Clear Coordinates
                    </button>
                  )}
                </div>

                {/* EDITABLE LATITUDE & LONGITUDE INPUTS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-[#17324D] mb-1">
                      Latitude <span className="text-gray-400 font-normal">(-90.000000 to +90.000000)</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="-90"
                      max="90"
                      value={coords.lat}
                      onChange={(e) => {
                        setValidationError('');
                        setCoords(prev => ({ ...prev, lat: e.target.value }));
                      }}
                      placeholder="e.g. 26.846708"
                      className="w-full px-3 py-2 text-xs font-mono bg-white border border-[#D9E4ED] rounded focus:outline-none focus:border-[#2878B8] focus:ring-1 focus:ring-[#2878B8]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#17324D] mb-1">
                      Longitude <span className="text-gray-400 font-normal">(-180.000000 to +180.000000)</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="-180"
                      max="180"
                      value={coords.lng}
                      onChange={(e) => {
                        setValidationError('');
                        setCoords(prev => ({ ...prev, lng: e.target.value }));
                      }}
                      placeholder="e.g. 80.946166"
                      className="w-full px-3 py-2 text-xs font-mono bg-white border border-[#D9E4ED] rounded focus:outline-none focus:border-[#2878B8] focus:ring-1 focus:ring-[#2878B8]"
                    />
                  </div>
                </div>

                {/* MAP PICKER */}
                <div className="pt-2">
                  <LocationPicker
                    value={coords.lat && coords.lng ? coords : null}
                    onChange={(selectedLoc) => {
                      setValidationError('');
                      setCoords({ lat: selectedLoc.lat, lng: selectedLoc.lng });
                      if (selectedLoc.address) {
                        setDetectedAddress(selectedLoc.address);
                        // If description is empty, auto-populate
                        if (!location.address && !location.landmark) {
                          setLocation(prev => ({
                            ...prev,
                            address: selectedLoc.address,
                            landmark: selectedLoc.address
                          }));
                        }
                      }
                    }}
                  />
                </div>
              </div>

              {/* OPTIONAL ADMINISTRATIVE DETAILS SECTION */}
              <div className="border border-[#D9E4ED] rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowAdminDetails(!showAdminDetails)}
                  className="w-full p-3.5 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-[#2878B8]" />
                    <span className="text-xs font-bold text-[#123B68]">
                      Administrative Region (Optional Helper Fields)
                    </span>
                    {(location.state || location.district || location.city || location.pincode) && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                        Specified
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#2878B8] font-bold">
                    {showAdminDetails ? '▲ Hide' : '▼ Expand'}
                  </span>
                </button>

                {showAdminDetails && (
                  <div className="p-4 space-y-3.5 bg-white border-t border-[#D9E4ED] animate-fade-in">
                    <p className="text-[11px] text-[#58718A]">
                      These optional fields help regional authorities route challenges to local administrative units.
                    </p>

                    {/* STATE DROPDOWN */}
                    <SearchableDropdown
                      label="State / Union Territory (Optional)"
                      id="state-select"
                      required={false}
                      placeholder="-- Select State or UT --"
                      searchPlaceholder="Search Indian States / UTs..."
                      options={getAllStates().map(s => s.name)}
                      value={location.state}
                      onChange={handleStateChange}
                      helperText="Available for all 28 Indian States and 8 Union Territories"
                    />

                    {/* DISTRICT DROPDOWN */}
                    <SearchableDropdown
                      label="District (Optional)"
                      id="district-select"
                      required={false}
                      disabled={!location.state}
                      placeholder={location.state ? "-- Select District --" : "Please select State first"}
                      searchPlaceholder={`Search district in ${location.state || 'selected State'}...`}
                      options={availableDistricts}
                      value={location.district}
                      onChange={handleDistrictChange}
                      helperText={location.state ? `Showing districts for ${location.state}` : 'Disabled until State is selected'}
                    />

                    {/* CITY / TOWN / VILLAGE DROPDOWN */}
                    <SearchableDropdown
                      label="City / Town / Village (Optional)"
                      id="city-select"
                      required={false}
                      disabled={!location.district}
                      placeholder={location.district ? "-- Select or Search Location --" : "Please select District first"}
                      searchPlaceholder={`Search city, town or village in ${location.district || 'district'}...`}
                      options={availableCities}
                      value={location.city}
                      onChange={handleCityChange}
                      allowCustom={true}
                      customPlaceholder="Type village / mohalla if not listed..."
                      helperText="Select or type your specific town, ward, village or mohalla"
                    />

                    {/* PINCODE */}
                    <div>
                      <label className="block text-xs font-bold text-[#123B68] mb-1.5">
                        Postal Pincode (Optional - 6 Digits)
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={location.pincode}
                        onChange={(e) => {
                          setValidationError('');
                          setLocation({ ...location, pincode: e.target.value.replace(/[^0-9]/g, '') });
                        }}
                        placeholder="e.g. 273001, 834001, 400001, 560001"
                        className="w-full px-3 py-2 text-sm bg-white border border-[#D9E4ED] rounded focus:outline-none focus:border-[#2878B8] focus:ring-1 focus:ring-[#2878B8]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step 2 Actions */}
            <div className="pt-4 border-t border-[#D9E4ED] flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-[#58718A] hover:text-[#123B68] flex items-center gap-1.5"
              >
                <ChevronLeft size={16} />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-[#123B68] hover:bg-[#0B2440] text-white font-bold text-xs sm:text-sm rounded transition-all flex items-center gap-2 shadow-xs"
              >
                <span>Continue to Challenge</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: COMPLAINT DETAILS ─────────────────────────── */}
        {step === 2 && (
          <div className="bg-white rounded-lg border border-[#D9E4ED] p-5 sm:p-7 shadow-xs space-y-5 animate-fade-in">
            <div className="border-b border-[#D9E4ED] pb-3">
              <span className="text-[11px] font-bold text-[#F58220] uppercase tracking-wider block">
                STEP 3 OF 6
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#123B68]">
                Complaint Particulars
              </h2>
              <p className="text-xs text-[#58718A] mt-0.5">
                Describe the problem clearly. Our automated routing system directs this directly to the responsible authority.
              </p>
            </div>

            <div className="space-y-4">
              {/* Category Dropdown */}
              <div>
                <label className="block text-xs font-bold text-[#123B68] mb-1.5">
                  Complaint Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={complaint.category}
                  onChange={(e) => {
                    setValidationError('');
                    setComplaint({ ...complaint, category: e.target.value });
                  }}
                  className="w-full px-3 py-2.5 text-sm bg-white border border-[#D9E4ED] rounded focus:outline-none focus:border-[#2878B8] focus:ring-1 focus:ring-[#2878B8]"
                >
                  <option value="">-- Select Category --</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title / Subject */}
              <div>
                <label className="block text-xs font-bold text-[#123B68] mb-1.5">
                  Complaint Subject / Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={complaint.title}
                  onChange={(e) => {
                    setValidationError('');
                    setComplaint({ ...complaint, title: e.target.value });
                  }}
                  placeholder="e.g. Hazardous deep pothole on Main Road causing accidents"
                  className="w-full px-3 py-2.5 text-sm bg-white border border-[#D9E4ED] rounded focus:outline-none focus:border-[#2878B8] focus:ring-1 focus:ring-[#2878B8]"
                />
                <span className="text-[11px] text-[#58718A] mt-1 block">
                  Minimum 10 characters summarizing the civic issue.
                </span>
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-xs font-bold text-[#123B68] mb-1.5">
                  Detailed Description of Problem <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  value={complaint.description}
                  onChange={(e) => {
                    setValidationError('');
                    setComplaint({ ...complaint, description: e.target.value });
                  }}
                  placeholder="Please state how long the problem has existed, exact location details, how it affects residents or traffic, and any previous attempts to get it resolved..."
                  className="w-full p-3 text-sm bg-white border border-[#D9E4ED] rounded focus:outline-none focus:border-[#2878B8] focus:ring-1 focus:ring-[#2878B8] leading-relaxed"
                />
                <div className="flex justify-between items-center text-[11px] text-[#58718A] mt-1">
                  <span>Minimum 20 characters required.</span>
                  <span>{complaint.description.length} characters</span>
                </div>
              </div>

              {/* Urgency Level */}
              <div>
                <label className="block text-xs font-bold text-[#123B68] mb-1.5">
                  Perceived Urgency / Severity
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'low', label: 'Routine (Low)', desc: 'General maintenance' },
                    { id: 'medium', label: 'Important (Medium)', desc: 'Standard redressal' },
                    { id: 'high', label: 'Urgent (High)', desc: 'Safety or health hazard' }
                  ].map(u => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setComplaint({ ...complaint, urgency: u.id })}
                      className={`p-2.5 rounded border text-left transition-all ${
                        complaint.urgency === u.id
                          ? 'border-[#123B68] bg-[#EEF7FC] ring-1 ring-[#123B68]'
                          : 'border-[#D9E4ED] hover:bg-gray-50'
                      }`}
                    >
                      <span className="block text-xs font-bold text-[#123B68]">{u.label}</span>
                      <span className="text-[10px] text-[#58718A] block mt-0.5">{u.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3 Actions */}
            <div className="pt-4 border-t border-[#D9E4ED] flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-[#58718A] hover:text-[#123B68] flex items-center gap-1.5"
              >
                <ChevronLeft size={16} />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-[#123B68] hover:bg-[#0B2440] text-white font-bold text-xs sm:text-sm rounded transition-all flex items-center gap-2 shadow-xs"
              >
                <span>Continue to Documents</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: SUPPORTING DOCUMENTS & PHOTOS ─────────────── */}
        {step === 3 && (
          <div className="bg-white rounded-lg border border-[#D9E4ED] p-5 sm:p-7 shadow-xs space-y-5 animate-fade-in">
            <div className="border-b border-[#D9E4ED] pb-3">
              <span className="text-[11px] font-bold text-[#F58220] uppercase tracking-wider block">
                STEP 4 OF 6
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#123B68]">
                Supporting Documents &amp; Photos
              </h2>
              <p className="text-xs text-[#58718A] mt-0.5">
                Attach photos of the issue or relevant documents. This step is optional, but photographs significantly speed up resolution.
              </p>
            </div>

            {fileError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-xs flex items-center gap-2">
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{fileError}</span>
              </div>
            )}

            {/* Upload Area */}
            <div className="border-2 border-dashed border-[#D9E4ED] hover:border-[#2878B8] rounded-lg p-6 sm:p-8 text-center transition-colors bg-[#F8FAFC]">
              <Upload size={32} className="mx-auto text-[#2878B8] mb-2" />
              <h3 className="text-sm font-bold text-[#123B68]">
                Upload Site Photos or Documents
              </h3>
              <p className="text-xs text-[#58718A] mt-1 mb-3">
                Supported formats: <strong>JPG, JPEG, PNG, PDF</strong> (Maximum 5 MB per file)
              </p>

              <label className="inline-block px-4 py-2 bg-[#123B68] hover:bg-[#0B2440] text-white text-xs font-bold rounded cursor-pointer transition-colors shadow-xs">
                <span>Browse Files</span>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/jpg,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Uploaded Files List */}
            {files.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#123B68] uppercase tracking-wide">
                  Attached Files ({files.length}):
                </h4>
                <div className="divide-y divide-gray-100 border border-[#D9E4ED] rounded-md overflow-hidden bg-white">
                  {files.map((file, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText size={16} className="text-[#2878B8] flex-shrink-0" />
                        <div className="truncate">
                          <span className="text-xs font-semibold text-[#17324D] block truncate">
                            {file.name}
                          </span>
                          <span className="text-[10px] text-[#58718A]">
                            {file.size} · {file.type.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="text-gray-400 hover:text-red-600 p-1.5 rounded transition-colors"
                        title="Remove file"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4 Actions */}
            <div className="pt-4 border-t border-[#D9E4ED] flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-[#58718A] hover:text-[#123B68] flex items-center gap-1.5"
              >
                <ChevronLeft size={16} />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-[#123B68] hover:bg-[#0B2440] text-white font-bold text-xs sm:text-sm rounded transition-all flex items-center gap-2 shadow-xs"
              >
                <span>Review Grievance</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 5: REVIEW SUMMARY BEFORE SUBMIT ──────────────── */}
        {step === 4 && (
          <div className="bg-white rounded-lg border border-[#D9E4ED] p-5 sm:p-7 shadow-xs space-y-5 animate-fade-in">
            <div className="border-b border-[#D9E4ED] pb-3">
              <span className="text-[11px] font-bold text-[#F58220] uppercase tracking-wider block">
                STEP 5 OF 6
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#123B68]">
                Review Your Grievance Before Submission
              </h2>
              <p className="text-xs text-[#58718A] mt-0.5">
                Please double-check all details below. You can click "Edit" on any section to modify information.
              </p>
            </div>

            {/* Section 1 Review: Citizen Info */}
            <div className="border border-[#D9E4ED] rounded-md p-4 bg-[#F8FAFC]">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#D9E4ED]">
                <span className="font-bold text-xs text-[#123B68] uppercase tracking-wide">
                  1. Citizen Particulars
                </span>
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="text-xs text-[#2878B8] hover:underline font-semibold"
                >
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[#58718A] block">Full Name:</span>
                  <span className="font-semibold text-[#17324D]">{citizen.name}</span>
                </div>
                <div>
                  <span className="text-[#58718A] block">Mobile:</span>
                  <span className="font-semibold text-[#17324D]">{citizen.mobile}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[#58718A] block">Address:</span>
                  <span className="text-[#17324D]">{citizen.address}</span>
                </div>
              </div>
            </div>

            {/* Section 2 Review: Location */}
            <div className="border border-[#D9E4ED] rounded-md p-4 bg-[#F8FAFC]">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#D9E4ED]">
                <span className="font-bold text-xs text-[#123B68] uppercase tracking-wide">
                  2. Challenge Location
                </span>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-[#2878B8] hover:underline font-semibold"
                >
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="sm:col-span-2">
                  <span className="text-[#58718A] block">Address / Location Description:</span>
                  <span className="font-semibold text-[#17324D]">{location.address || location.landmark || 'GPS Pin Location'}</span>
                </div>
                {coords?.lat && coords?.lng && (
                  <div className="sm:col-span-2">
                    <span className="text-[#58718A] block">GPS Coordinates:</span>
                    <span className="font-mono font-semibold text-[#123B68] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block">
                      📍 Lat: {coords.lat}, Lng: {coords.lng}
                    </span>
                  </div>
                )}
                {location.state && (
                  <div>
                    <span className="text-[#58718A] block">State / UT:</span>
                    <span className="font-semibold text-[#17324D]">{location.state}</span>
                  </div>
                )}
                {location.district && (
                  <div>
                    <span className="text-[#58718A] block">District:</span>
                    <span className="font-semibold text-[#17324D]">{location.district}</span>
                  </div>
                )}
                {location.city && (
                  <div>
                    <span className="text-[#58718A] block">City / Town / Village:</span>
                    <span className="font-semibold text-[#17324D]">{location.city}</span>
                  </div>
                )}
                {location.pincode && (
                  <div>
                    <span className="text-[#58718A] block">Postal Pincode:</span>
                    <span className="font-semibold text-[#17324D]">{location.pincode}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Section 3 Review: Complaint Details */}
            <div className="border border-[#D9E4ED] rounded-md p-4 bg-[#F8FAFC]">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#D9E4ED]">
                <span className="font-bold text-xs text-[#123B68] uppercase tracking-wide">
                  3. Complaint Details
                </span>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs text-[#2878B8] hover:underline font-semibold"
                >
                  Edit
                </button>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[#58718A] block">Category:</span>
                  <span className="font-bold text-[#123B68]">{complaint.category}</span>
                </div>
                <div>
                  <span className="text-[#58718A] block">Title / Subject:</span>
                  <span className="font-semibold text-[#17324D]">{complaint.title}</span>
                </div>
                <div>
                  <span className="text-[#58718A] block">Description:</span>
                  <p className="text-[#17324D] bg-white p-2.5 rounded border border-[#D9E4ED] mt-0.5 leading-relaxed">
                    {complaint.description}
                  </p>
                </div>
                <div>
                  <span className="text-[#58718A] block">Attachments:</span>
                  <span className="text-[#17324D]">
                    {files.length > 0 ? `${files.length} file(s) attached` : 'No documents attached'}
                  </span>
                </div>
              </div>
            </div>

            {/* Declaration Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={declarationAgreed}
                  onChange={(e) => setDeclarationAgreed(e.target.checked)}
                  className="mt-0.5 rounded border-gray-300 text-[#123B68] focus:ring-[#123B68]"
                />
                <span className="text-xs text-[#17324D] leading-snug">
                  I hereby declare that the facts and particulars stated in this grievance are genuine, true, and accurate to the best of my knowledge under statutory public redressal norms.
                </span>
              </label>
            </div>

            {/* Step 5 Actions (Submit Button) */}
            <div className="pt-4 border-t border-[#D9E4ED] flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                disabled={submitting}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-[#58718A] hover:text-[#123B68] flex items-center gap-1.5"
              >
                <ChevronLeft size={16} />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={submitting || !declarationAgreed}
                onClick={handleSubmitGrievance}
                className="px-7 py-3 bg-[#F58220] hover:bg-[#E06D0C] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm rounded transition-all flex items-center gap-2 shadow-sm active:scale-[0.99]"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Registering Grievance...</span>
                  </>
                ) : (
                  <>
                    <span>Submit &amp; Generate Acknowledgement</span>
                    <ChevronRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
