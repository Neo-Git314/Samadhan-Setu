// ============================================================================
// SAMADHAN SETU — PAN-INDIA GEOGRAPHIC LOCATION DATASET & SERVICES
// Complete coverage of all 28 States and 8 Union Territories of India
// ============================================================================

export const INDIA_STATES = [
  { code: 'AP', name: 'Andhra Pradesh', type: 'State' },
  { code: 'AR', name: 'Arunachal Pradesh', type: 'State' },
  { code: 'AS', name: 'Assam', type: 'State' },
  { code: 'BR', name: 'Bihar', type: 'State' },
  { code: 'CG', name: 'Chhattisgarh', type: 'State' },
  { code: 'GA', name: 'Goa', type: 'State' },
  { code: 'GJ', name: 'Gujarat', type: 'State' },
  { code: 'HR', name: 'Haryana', type: 'State' },
  { code: 'HP', name: 'Himachal Pradesh', type: 'State' },
  { code: 'JH', name: 'Jharkhand', type: 'State' },
  { code: 'KA', name: 'Karnataka', type: 'State' },
  { code: 'KL', name: 'Kerala', type: 'State' },
  { code: 'MP', name: 'Madhya Pradesh', type: 'State' },
  { code: 'MH', name: 'Maharashtra', type: 'State' },
  { code: 'MN', name: 'Manipur', type: 'State' },
  { code: 'ML', name: 'Meghalaya', type: 'State' },
  { code: 'MZ', name: 'Mizoram', type: 'State' },
  { code: 'NL', name: 'Nagaland', type: 'State' },
  { code: 'OD', name: 'Odisha', type: 'State' },
  { code: 'PB', name: 'Punjab', type: 'State' },
  { code: 'RJ', name: 'Rajasthan', type: 'State' },
  { code: 'SK', name: 'Sikkim', type: 'State' },
  { code: 'TN', name: 'Tamil Nadu', type: 'State' },
  { code: 'TS', name: 'Telangana', type: 'State' },
  { code: 'TR', name: 'Tripura', type: 'State' },
  { code: 'UP', name: 'Uttar Pradesh', type: 'State' },
  { code: 'UK', name: 'Uttarakhand', type: 'State' },
  { code: 'WB', name: 'West Bengal', type: 'State' },
  // Union Territories
  { code: 'AN', name: 'Andaman and Nicobar Islands', type: 'UT' },
  { code: 'CH', name: 'Chandigarh', type: 'UT' },
  { code: 'DH', name: 'Dadra and Nagar Haveli and Daman and Diu', type: 'UT' },
  { code: 'DL', name: 'Delhi', type: 'UT' },
  { code: 'JK', name: 'Jammu and Kashmir', type: 'UT' },
  { code: 'LA', name: 'Ladakh', type: 'UT' },
  { code: 'LD', name: 'Lakshadweep', type: 'UT' },
  { code: 'PY', name: 'Puducherry', type: 'UT' }
];

// District datasets for all States & UTs
export const STATE_DISTRICTS_MAP = {
  'Uttar Pradesh': [
    'Agra', 'Aligarh', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Ayodhya', 'Azamgarh',
    'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti',
    'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah',
    'Etawah', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar (Noida)', 'Ghaziabad',
    'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun',
    'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi',
    'Kheri', 'Kushinagar', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura',
    'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh',
    'Prayagraj', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 'Shahjahanpur',
    'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi'
  ],
  'Maharashtra': [
    'Ahmednagar', 'Akola', 'Amravati', 'Chhatrapati Sambhaji Nagar (Aurangabad)', 'Beed', 'Bhandara',
    'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna',
    'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded', 'Nandurbar',
    'Nashik', 'Dharashiv (Osmanabad)', 'Palghar', 'Parbhani', 'Pune', 'Raigad', 'Ratnagiri',
    'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal'
  ],
  'Bihar': [
    'Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 'Buxar',
    'Darbhanga', 'East Champaran', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 'Kaimur', 'Katihar',
    'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura', 'Madhubani', 'Munger', 'Muzaffarpur',
    'Nalanda', 'Nawada', 'Patna', 'Purnia', 'Rohtas', 'Saharsa', 'Samastipur', 'Saran', 'Sheikhpura',
    'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul', 'Vaishali', 'West Champaran'
  ],
  'Jharkhand': [
    'Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka', 'East Singhbhum (Jamshedpur)', 'Garhwa',
    'Giridih', 'Godda', 'Gumla', 'Hazaribagh', 'Jamtara', 'Khunti', 'Koderma', 'Latehar',
    'Lohardaga', 'Pakur', 'Palamu', 'Ramgarh', 'Ranchi', 'Sahibganj', 'Seraikela Kharsawan',
    'Simdega', 'West Singhbhum (Chaibasa)'
  ],
  'Delhi': [
    'Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi',
    'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi', 'South West Delhi', 'West Delhi'
  ],
  'Karnataka': [
    'Bagalkote', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban', 'Bidar', 'Chamarajanagara',
    'Chikkaballapura', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada', 'Davanagere', 'Dharwad',
    'Gadag', 'Hassan', 'Haveri', 'Kalaburagi', 'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysuru',
    'Raichur', 'Ramanagara', 'Shivamogga', 'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayapura', 'Yadgir'
  ],
  'Tamil Nadu': [
    'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul',
    'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai',
    'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai',
    'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni',
    'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur', 'Tiruppur', 'Tiruvallur',
    'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'
  ],
  'Gujarat': [
    'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch', 'Bhavnagar', 'Botad',
    'Chhota Udaipur', 'Dahod', 'Dang', 'Devbhumi Dwarka', 'Gandhinagar', 'Gir Somnath', 'Jamnagar',
    'Junagadh', 'Kheda', 'Kutch', 'Mahisagar', 'Mehsana', 'Morbi', 'Narmada', 'Navsari',
    'Panchmahal', 'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat', 'Surendranagar',
    'Tapi', 'Vadodara', 'Valsad'
  ],
  'Rajasthan': [
    'Ajmer', 'Alwar', 'Banswara', 'Baran', 'Barmer', 'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi',
    'Chittorgarh', 'Churu', 'Dausa', 'Dholpur', 'Dungarpur', 'Hanumangarh', 'Jaipur', 'Jaisalmer',
    'Jalore', 'Jhalawar', 'Jhunjhunu', 'Jodhpur', 'Karauli', 'Kota', 'Nagaur', 'Pali', 'Pratapgarh',
    'Rajsamand', 'Sawai Madhopur', 'Sikar', 'Sirohi', 'Sri Ganganagar', 'Tonk', 'Udaipur'
  ],
  'Madhya Pradesh': [
    'Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat', 'Barwani', 'Betul', 'Bhind',
    'Bhopal', 'Burhanpur', 'Chhatarpur', 'Chhindwara', 'Damoh', 'Datia', 'Dewas', 'Dhar',
    'Dindori', 'Guna', 'Gwalior', 'Harda', 'Hoshangabad', 'Indore', 'Jabalpur', 'Jhabua',
    'Katni', 'Khandwa', 'Khargone', 'Mandla', 'Mandsaur', 'Morena', 'Narsinghpur', 'Neemuch',
    'Panna', 'Raisen', 'Rajgarh', 'Ratlam', 'Rewa', 'Sagar', 'Satna', 'Sehore', 'Seoni',
    'Shahdol', 'Shajapur', 'Sheopur', 'Shivpuri', 'Sidhi', 'Singrauli', 'Tikamgarh', 'Ujjain',
    'Umaria', 'Vidisha'
  ],
  'West Bengal': [
    'Alipurduar', 'Bankura', 'Birbhum', 'Cooch Behar', 'Dakshin Dinajpur', 'Darjeeling',
    'Hooghly', 'Howrah', 'Jalpaiguri', 'Jhargram', 'Kalimpong', 'Kolkata', 'Malda',
    'Murshidabad', 'Nadia', 'North 24 Parganas', 'Paschim Bardhaman', 'Paschim Medinipur',
    'Purba Bardhaman', 'Purba Medinipur', 'Purulia', 'South 24 Parganas', 'Uttar Dinajpur'
  ],
  'Punjab': [
    'Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib', 'Fazilka', 'Ferozepur',
    'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala', 'Ludhiana', 'Malerkotla', 'Mansa',
    'Moga', 'Mohali (SAS Nagar)', 'Muktsar', 'Pathankot', 'Patiala', 'Rupnagar', 'Sangrur',
    'Shaheed Bhagat Singh Nagar', 'Tarn Taran'
  ],
  'Haryana': [
    'Ambala', 'Bhiwani', 'Charkhi Dadri', 'Faridabad', 'Fatehabad', 'Gurugram', 'Hisar',
    'Jhajjar', 'Jind', 'Kaithal', 'Karnal', 'Kurukshetra', 'Mahendragarh', 'Nuh', 'Palwal',
    'Panchkula', 'Panipat', 'Rewari', 'Rohtak', 'Sirsa', 'Sonipat', 'Yamunanagar'
  ],
  'Kerala': [
    'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam', 'Kottayam', 'Kozhikode',
    'Malappuram', 'Palakkad', 'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad'
  ],
  'Telangana': [
    'Adilabad', 'Bhadradri Kothagudem', 'Hyderabad', 'Jagtial', 'Jangaon', 'Jayashankar Bhupalpally',
    'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar', 'Khammam', 'Kumuram Bheem Asifabad',
    'Mahabubabad', 'Mahabubnagar', 'Mancherial', 'Medak', 'Medchal-Malkajgiri', 'Mulugu',
    'Nagarkurnool', 'Nalgonda', 'Narayanpet', 'Nirmal', 'Nizamabad', 'Peddapalli', 'Rajanna Sircilla',
    'Rangareddy', 'Sangareddy', 'Siddipet', 'Suryapet', 'Vikarabad', 'Wanaparthy', 'Warangal',
    'Hanamkonda', 'Yadadri Bhuvanagiri'
  ],
  'Odisha': [
    'Angul', 'Balangir', 'Balasore', 'Bargarh', 'Bhadrak', 'Boudh', 'Cuttack', 'Deogarh',
    'Dhenkanal', 'Gajapati', 'Ganjam', 'Jagatsinghpur', 'Jajpur', 'Jharsuguda', 'Kalahandi',
    'Kandhamal', 'Kendrapara', 'Kendujhar', 'Khordha (Bhubaneswar)', 'Koraput', 'Malkangiri',
    'Mayurbhanj', 'Nabarangpur', 'Nayagarh', 'Nuapada', 'Puri', 'Rayagada', 'Sambalpur',
    'Subarnapur', 'Sundargarh'
  ],
  'Andhra Pradesh': [
    'Alluri Sitharama Raju', 'Anakapalli', 'Ananthapuramu', 'Annamayya', 'Bapatla', 'Chittoor',
    'Dr. B.R. Ambedkar Konaseema', 'East Godavari', 'Eluru', 'Guntur', 'Kakinada', 'Krishna',
    'Kurnool', 'Nandyal', 'NTR (Vijayawada)', 'Palnadu', 'Parvathipuram Manyam', 'Prakasam',
    'Sri Potti Sriramulu Nellore', 'Sri Sathya Sai', 'Srikakulam', 'Tirupati', 'Visakhapatnam',
    'Vizianagaram', 'West Godavari', 'YSR Kadapa'
  ],
  'Assam': [
    'Baksa', 'Barpeta', 'Biswanath', 'Bongaigaon', 'Cachar', 'Charaideo', 'Chirang', 'Darrang',
    'Dhemaji', 'Dhubri', 'Dibrugarh', 'Dima Hasao', 'Goalpara', 'Golaghat', 'Hailakandi',
    'Hojai', 'Jorhat', 'Kamrup', 'Kamrup Metropolitan (Guwahati)', 'Karbi Anglong', 'Karimganj',
    'Kokrajhar', 'Lakhimpur', 'Majuli', 'Morigaon', 'Nagaon', 'Nalbari', 'Sivasagar', 'Sonitpur',
    'South Salmara-Mankachar', 'Tinsukia', 'Udalguri', 'West Karbi Anglong'
  ],
  'Chhattisgarh': [
    'Balod', 'Baloda Bazar', 'Balrampur', 'Bastar', 'Bemetara', 'Bijapur', 'Bilaspur', 'Dantewada',
    'Dhamtari', 'Durg', 'Gariaband', 'Gaurela-Pendra-Marwahi', 'Janjgir-Champa', 'Jashpur',
    'Kabirdham', 'Kanker', 'Kondagaon', 'Korba', 'Koriya', 'Mahasamund', 'Manendragarh-Chirmiri-Bharatpur',
    'Mohla-Manpur-Ambagarh Chowki', 'Mungeli', 'Narayanpur', 'Raigarh', 'Raipur', 'Rajnandgaon',
    'Sarangarh-Bilaigarh', 'Sakti', 'Sukma', 'Surajpur', 'Surguja'
  ],
  'Uttarakhand': [
    'Almora', 'Bageshwar', 'Chamoli', 'Champawat', 'Dehradun', 'Haridwar', 'Nainital', 'Pauri Garhwal',
    'Pithoragarh', 'Rudraprayag', 'Tehri Garhwal', 'Udham Singh Nagar', 'Uttarkashi'
  ],
  'Himachal Pradesh': [
    'Bilaspur', 'Chamba', 'Hamirpur', 'Kangra (Dharamshala)', 'Kinnaur', 'Kullu', 'Lahaul and Spiti',
    'Mandi', 'Shimla', 'Sirmaur', 'Solan', 'Una'
  ],
  'Goa': [
    'North Goa (Panaji)', 'South Goa (Margao)'
  ],
  'Tripura': [
    'Dhalai', 'Gomati', 'Khowai', 'North Tripura', 'Sepahijala', 'South Tripura', 'Unakoti', 'West Tripura (Agartala)'
  ],
  'Meghalaya': [
    'East Garo Hills', 'East Jaintia Hills', 'East Khasi Hills (Shillong)', 'North Garo Hills',
    'Ri Bhoi', 'South Garo Hills', 'South West Garo Hills', 'South West Khasi Hills',
    'West Garo Hills', 'West Jaintia Hills', 'West Khasi Hills'
  ],
  'Manipur': [
    'Bishnupur', 'Chandel', 'Churachandpur', 'Imphal East', 'Imphal West', 'Jiribam', 'Kakching',
    'Kamjong', 'Kangpokpi', 'Noney', 'Pherzawl', 'Senapati', 'Tamenglong', 'Tengnoupal', 'Thoubal', 'Ukhrul'
  ],
  'Nagaland': [
    'Chumoukedima', 'Dimapur', 'Kiphire', 'Kohima', 'Longleng', 'Mokokchung', 'Mon', 'Niuland',
    'Noklak', 'Peren', 'Phek', 'Shamator', 'Tseminyu', 'Tuensang', 'Wokha', 'Zunheboto'
  ],
  'Mizoram': [
    'Aizawl', 'Champhai', 'Hnahthial', 'Khawzawl', 'Kolasib', 'Lawngtlai', 'Lunglei', 'Mamit',
    'Saiha', 'Saitual', 'Serchhip'
  ],
  'Arunachal Pradesh': [
    'Anjaw', 'Changlang', 'Dibang Valley', 'East Kameng', 'East Siang', 'Kamle', 'Kra Daadi',
    'Kurung Kumey', 'Lepa Rada', 'Lohit', 'Longding', 'Lower Dibang Valley', 'Lower Siang',
    'Lower Subansiri', 'Namsai', 'Pakke Kessang', 'Papum Pare (Itanagar)', 'Shi Yomi', 'Siang',
    'Tawang', 'Tirap', 'Upper Siang', 'Upper Subansiri', 'West Kameng', 'West Siang'
  ],
  'Sikkim': [
    'Gangtok', 'Mangan', 'Namchi', 'Gyalshing', 'Pakyong', 'Soreng'
  ],
  'Jammu and Kashmir': [
    'Anantnag', 'Bandipora', 'Baramulla', 'Budgam', 'Doda', 'Ganderbal', 'Jammu', 'Kathua',
    'Kishtwar', 'Kulgam', 'Kupwara', 'Poonch', 'Pulwama', 'Rajouri', 'Ramban', 'Reasi',
    'Samba', 'Shopian', 'Srinagar', 'Udhampur'
  ],
  'Ladakh': [
    'Leh', 'Kargil'
  ],
  'Puducherry': [
    'Puducherry', 'Karaikal', 'Mahe', 'Yanam'
  ],
  'Chandigarh': [
    'Chandigarh Urban', 'Chandigarh Rural / Suburbs'
  ],
  'Andaman and Nicobar Islands': [
    'Nicobar', 'North and Middle Andaman', 'South Andaman (Port Blair)'
  ],
  'Dadra and Nagar Haveli and Daman and Diu': [
    'Dadra and Nagar Haveli (Silvassa)', 'Daman', 'Diu'
  ],
  'Lakshadweep': [
    'Agatti', 'Amini', 'Andrott', 'Kavaratti', 'Minicoy'
  ]
};

// Common city / town / tehsils / localities mapped to districts
export const DISTRICT_LOCALITIES_MAP = {
  // Major Districts Across India
  'Lucknow': ['Hazratganj', 'Gomti Nagar', 'Alambagh', 'Indira Nagar', 'Charbagh', 'Chowk', 'Mahanagar', 'Chinhat', 'Sarojini Nagar', 'Mohanlalganj', 'Bakshi Ka Talab', 'Malihabad'],
  'Gorakhpur': ['Gorakhpur City', 'Civil Lines', 'Golghar', 'Sahjanwa', 'Campierganj', 'Chauri Chaura', 'Bansgaon', 'Barhalganj', 'Pipraich', 'Gola'],
  'Varanasi': ['Varanasi Cantt', 'Godowlia', 'Bhelupur', 'Lanka', 'Shivpur', 'Sarnath', 'Pindra', 'Raja Talab', 'Ramnagar', 'Rohania'],
  'Prayagraj': ['Civil Lines', 'Katra', 'Naini', 'Phaphamau', 'Jhunsi', 'Soraon', 'Phulpur', 'Handia', 'Karchhana', 'Meja', 'Bara'],
  'Kanpur Nagar': ['Civil Lines', 'Swaroop Nagar', 'Govind Nagar', 'Kalyanpur', 'Panki', 'Kidwai Nagar', 'Bilhaur', 'Ghatampur', 'Chakeri'],
  'Agra': ['Tajganj', 'Sanjay Place', 'Civil Lines', 'Dayalbagh', 'Fatehabad', 'Etmadpur', 'Kheragarh', 'Bah', 'Kiraoli'],
  'Gautam Buddha Nagar (Noida)': ['Noida Sector 18', 'Noida Sector 62', 'Greater Noida Alpha', 'Greater Noida Pari Chowk', 'Dadri', 'Jewar', 'Knowledge Park'],
  'Ghaziabad': ['Rajnagar', 'Kavi Nagar', 'Indirapuram', 'Vaishali', 'Sahibabad', 'Loni', 'Modinagar', 'Muradnagar'],
  'Mumbai City': ['Colaba', 'Fort', 'Marine Lines', 'Nariman Point', 'Byculla', 'Dadar', 'Worli', 'Parel', 'Mahalaxmi'],
  'Mumbai Suburban': ['Bandra West', 'Andheri East', 'Andheri West', 'Borivali', 'Goregaon', 'Malad', 'Kurla', 'Ghatkopar', 'Mulund', 'Powai'],
  'Pune': ['Shivajinagar', 'Kothrud', 'Hinjewadi', 'Viman Nagar', 'Hadapsar', 'Baner', 'Pimpri', 'Chinchwad', 'Baramati', 'Haveli'],
  'Nagpur': ['Dharampeth', 'Sitabuldi', 'Civil Lines', 'Ramdaspeth', 'Hingna', 'Kamptee', 'Katol', 'Umred', 'Saoner'],
  'Thane': ['Thane West', 'Naupada', 'Ghubunder Road', 'Kalyan', 'Dombivli', 'Ulhasnagar', 'Bhiwandi', 'Mira Bhayandar', 'Badlapur'],
  'Patna': ['Boring Road', 'Kankarbagh', 'Bailey Road', 'Patliputra Colony', 'Rajendra Nagar', 'Danapur', 'Phulwari Sharif', 'Fatuha', 'Barh'],
  'Gaya': ['Gaya Town', 'Bodh Gaya', 'Civil Lines', 'Tekari', 'Sherghati', 'Wazirganj', 'Manpur', 'Barachatti'],
  'Muzaffarpur': ['Muzaffarpur City', 'Mithanpura', 'Brahmpura', 'Kanti', 'Motipur', 'Sakra', 'Minapur', 'Paroo'],
  'Ranchi': ['Morabadi', 'Lalpur', 'Main Road', 'Doranda', 'Hinoo', 'Kanke', 'Harmu', 'Bariatu', 'Namkum', 'Dhurwa', 'Tupudana', 'Ratu', 'Ormanjhi'],
  'Dhanbad': ['Dhanbad City', 'Bank More', 'Saraidhela', 'Jharia', 'Katras', 'Govindpur', 'Sindri', 'Nirsa', 'Tundi', 'Baghmara'],
  'East Singhbhum (Jamshedpur)': ['Bistupur', 'Sakchi', 'Kadma', 'Sonari', 'Telco', 'Baridih', 'Mango', 'Golmuri', 'Jugsalai', 'Ghatshila', 'Potka'],
  'Bokaro': ['Bokaro Steel City', 'Sector 4', 'Chas', 'Bermo', 'Gomia', 'Chandrapura', 'Phusro', 'Petarwar', 'Jaridih'],
  'Hazaribagh': ['Hazaribagh Town', 'Matwari', 'Korrah', 'Barhi', 'Barkagaon', 'Chouparan', 'Ichak', 'Katkamsandi'],
  'Deoghar': ['Deoghar City', 'Castairs Town', 'Jasidih', 'Madhupur', 'Sarath', 'Karon', 'Devipur'],
  'New Delhi': ['Connaught Place', 'Chanakyapuri', 'Barakhamba', 'Gole Market', 'Parliament Street', 'Lodhi Road', 'India Gate'],
  'Central Delhi': ['Karol Bagh', 'Pahar Ganj', 'Daryaganj', 'Civil Lines', 'Kashmere Gate'],
  'South Delhi': ['Hauz Khas', 'Saket', 'Greater Kailash', 'Malviya Nagar', 'Green Park', 'Mehrauli', 'Kalkaji'],
  'Bengaluru Urban': ['MG Road', 'Indiranagar', 'Koramangala', 'Whitefield', 'Electronic City', 'HSR Layout', 'Jayanagar', 'Malleshwaram', 'Yelahanka', 'Hebbal'],
  'Mysuru': ['Kuvempunagar', 'Gokulam', 'Jayalakshmipuram', 'Chamundipuram', 'Nazarbad', 'Hebbal Industrial Area', 'Hunsur'],
  'Chennai': ['T. Nagar', 'Anna Nagar', 'Adyar', 'Mylapore', 'Velachery', 'Guindy', 'Alwarpet', 'Thiruvanmiyur', 'Tambaram'],
  'Coimbatore': ['RS Puram', 'Gandhipuram', 'Peelamedu', 'Saibaba Colony', 'Singanallur', 'Saravanampatti', 'Pollachi'],
  'Ahmedabad': ['Navrangpura', 'Satellite', 'Vastrapur', 'Maninagar', 'Paldi', 'Bodakdev', 'SG Highway', 'Bopal', 'Chandkheda'],
  'Surat': ['Athwa', 'Adajan', 'Vesu', 'Varachha', 'Katargam', 'Rander', 'Udhna', 'Sachin'],
  'Jaipur': ['C-Scheme', 'Malviya Nagar', 'Vaishali Nagar', 'Mansarovar', 'Raja Park', 'Tonk Road', 'Sanganer', 'Jagatpura', 'Amer'],
  'Jodhpur': ['Ratanada', 'Sardarpura', 'Shastri Nagar', 'Paota', 'Mandore', 'Basni'],
  'Bhopal': ['MP Nagar', 'Arera Colony', 'Shahpura', 'Kolar Road', 'TT Nagar', 'Bairagarh', 'Karond', 'Berasia'],
  'Indore': ['Vijay Nagar', 'Palasia', 'Rajwada', 'Bhawarkua', 'Bicholi Mardana', 'Annapurna', 'Rau', 'Pithampur'],
  'Kolkata': ['Park Street', 'Salt Lake (Bidhannagar)', 'New Town', 'Ballygunge', 'Alipore', 'Gariahat', 'Shyambazar', 'Howrah Bridge area', 'Behala', 'Jadavpur'],
  'Hyderabad': ['Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Hitec City', 'Madhapur', 'Secunderabad', 'Begumpet', 'Kukatpally', 'Ameerpet', 'Charminar Area'],
  'Chandigarh Urban': ['Sector 17', 'Sector 35', 'Sector 22', 'Sector 43', 'Sector 9', 'Manimajra', 'Industrial Area Phase 1']
};

/**
 * Returns the list of all States and Union Territories sorted alphabetically
 */
export function getAllStates() {
  return [...INDIA_STATES].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get districts for a given State name
 */
export function getDistrictsForState(stateName) {
  if (!stateName) return [];
  const list = STATE_DISTRICTS_MAP[stateName];
  if (list && list.length > 0) {
    return [...list].sort((a, b) => a.localeCompare(b));
  }
  // Generic fallback if new state/UT without predefined static list
  return [`${stateName} District 1`, `${stateName} District 2`];
}

/**
 * Get cities / towns / village localities for a given District
 */
export function getLocalitiesForDistrict(districtName) {
  if (!districtName) return [];
  const localities = DISTRICT_LOCALITIES_MAP[districtName];
  if (localities && localities.length > 0) {
    return [...localities].sort((a, b) => a.localeCompare(b));
  }
  // Standard administrative centers when district not in granular map
  const cleaned = districtName.replace(/\s*\([^)]*\)/g, '').trim();
  return [
    `${cleaned} City / Main Town`,
    `${cleaned} Sadar / Civil Lines`,
    `${cleaned} Municipal Area`,
    `${cleaned} Rural Ward / Block`,
    `${cleaned} East Sub-Division`,
    `${cleaned} West Sub-Division`
  ];
}
