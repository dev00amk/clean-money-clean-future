// Application State
class RiskAssessmentApp {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 7;
        this.formData = {};
        this.riskScore = 0;
        this.categoryScores = {};
        
        // Risk categories with weights from application data
        this.riskCategories = {
            legal_compliance: { name: "Legal/Compliance Risk", weight: 0.25 },
            financial_stability: { name: "Financial Stability Risk", weight: 0.20 },
            source_of_funds: { name: "Source of Funds Risk", weight: 0.20 },
            reputational: { name: "Reputational Risk", weight: 0.15 },
            transparency: { name: "Transparency Risk", weight: 0.10 },
            family_external: { name: "Family/External Risk", weight: 0.05 },
            personal_safety: { name: "Personal Safety Risk", weight: 0.03 },
            future_exposure: { name: "Future Exposure Risk", weight: 0.02 }
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.showPage('welcomePage');
    }
    
    bindEvents() {
        // Welcome page events
        document.getElementById('startAssessment').addEventListener('click', () => {
            this.startAssessment();
        });
        
        document.getElementById('viewEducation').addEventListener('click', () => {
            this.showPage('educationPage');
        });
        
        document.getElementById('viewEducation2').addEventListener('click', () => {
            this.showPage('educationPage');
        });
        
        // Step navigation events
        document.getElementById('nextStep').addEventListener('click', () => {
            this.nextStep();
        });
        
        document.getElementById('prevStep').addEventListener('click', () => {
            this.prevStep();
        });
        
        document.getElementById('calculateRisk').addEventListener('click', () => {
            this.calculateRisk();
        });
        
        // Education page navigation
        document.getElementById('backToWelcome').addEventListener('click', () => {
            this.showPage('welcomePage');
        });
        
        document.getElementById('backToAssessment').addEventListener('click', () => {
            if (Object.keys(this.formData).length > 0) {
                this.showPage('assessmentPage');
                this.updateProgressBar();
            } else {
                this.showPage('welcomePage');
            }
        });
        
        // Results page actions
        document.getElementById('startOver').addEventListener('click', () => {
            this.resetAssessment();
        });
        
        // Form change events for auto-save
        document.addEventListener('change', (e) => {
            if (e.target.matches('#assessmentPage input, #assessmentPage select')) {
                this.saveFormData();
            }
        });
    }
    
    startAssessment() {
        this.currentStep = 1;
        this.showPage('assessmentPage');
        this.showStep(1);
        this.updateProgressBar();
        document.getElementById('progressContainer').style.display = 'flex';
    }
    
    showPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Hide progress bar on non-assessment pages
        if (pageId !== 'assessmentPage') {
            document.getElementById('progressContainer').style.display = 'none';
        }
    }
    
    showStep(stepNumber) {
        // Hide all steps
        document.querySelectorAll('.step').forEach(step => {
            step.style.display = 'none';
            step.classList.remove('active');
        });
        
        // Show current step
        const currentStepEl = document.getElementById(`step${stepNumber}`);
        if (currentStepEl) {
            currentStepEl.style.display = 'block';
            setTimeout(() => {
                currentStepEl.classList.add('active');
            }, 50);
        }
        
        // Update navigation buttons
        this.updateNavigationButtons();
    }
    
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevStep');
        const nextBtn = document.getElementById('nextStep');
        const calculateBtn = document.getElementById('calculateRisk');
        
        prevBtn.style.display = this.currentStep > 1 ? 'block' : 'none';
        
        if (this.currentStep < this.totalSteps) {
            nextBtn.style.display = 'block';
            calculateBtn.style.display = 'none';
        } else {
            nextBtn.style.display = 'none';
            calculateBtn.style.display = 'block';
        }
    }
    
    updateProgressBar() {
        const progress = (this.currentStep / this.totalSteps) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
        document.getElementById('progressText').textContent = `Step ${this.currentStep} of ${this.totalSteps}`;
    }
    
    nextStep() {
        if (this.validateCurrentStep()) {
            this.saveFormData();
            this.currentStep++;
            this.showStep(this.currentStep);
            this.updateProgressBar();
        }
    }
    
    prevStep() {
        this.currentStep--;
        this.showStep(this.currentStep);
        this.updateProgressBar();
    }
    
    validateCurrentStep() {
        // Basic validation - ensure required fields are filled
        const currentStepEl = document.getElementById(`step${this.currentStep}`);
        const requiredFields = currentStepEl.querySelectorAll('input[required], select[required]');
        
        for (let field of requiredFields) {
            if (!field.value.trim()) {
                field.focus();
                alert('Please fill in all required fields before proceeding.');
                return false;
            }
        }
        return true;
    }
    
    saveFormData() {
        const formElements = document.querySelectorAll('#assessmentPage input, #assessmentPage select');
        formElements.forEach(element => {
            if (element.type === 'checkbox') {
                if (!this.formData[element.name]) {
                    this.formData[element.name] = [];
                }
                if (element.checked) {
                    if (!this.formData[element.name].includes(element.value)) {
                        this.formData[element.name].push(element.value);
                    }
                } else {
                    this.formData[element.name] = this.formData[element.name].filter(v => v !== element.value);
                }
            } else {
                this.formData[element.id] = element.value;
            }
        });
    }
    
    calculateRisk() {
        this.saveFormData();
        this.calculateCategoryScores();
        this.calculateOverallScore();
        this.showResults();
    }
    
    calculateCategoryScores() {
        this.categoryScores = {};
        
        // Legal/Compliance Risk (25%)
        let legalScore = 100;
        if (this.formData.taxCompliance === 'non-compliant') legalScore -= 40;
        else if (this.formData.taxCompliance === 'significant-issues') legalScore -= 25;
        else if (this.formData.taxCompliance === 'minor-issues') legalScore -= 10;
        
        if (this.formData.investigations === 'criminal') legalScore -= 35;
        else if (this.formData.investigations === 'regulatory') legalScore -= 25;
        else if (this.formData.investigations === 'civil') legalScore -= 15;
        
        if (this.formData.sanctions === 'sanctions') legalScore -= 40;
        else if (this.formData.sanctions === 'significant-media') legalScore -= 20;
        else if (this.formData.sanctions === 'minor-media') legalScore -= 10;
        
        if (this.formData.criminalHistory === 'money-laundering') legalScore -= 50;
        else if (this.formData.criminalHistory === 'significant') legalScore -= 30;
        else if (this.formData.criminalHistory === 'minor') legalScore -= 15;
        
        if (this.formData.pepStatus === 'direct') legalScore -= 25;
        else if (this.formData.pepStatus === 'associate') legalScore -= 15;
        else if (this.formData.pepStatus === 'family') legalScore -= 10;
        
        this.categoryScores.legal_compliance = Math.max(0, legalScore);
        
        // Financial Stability Risk (20%)
        let financialScore = 100;
        if (this.formData.creditCardDebt === 'high') financialScore -= 25;
        else if (this.formData.creditCardDebt === 'moderate') financialScore -= 15;
        else if (this.formData.creditCardDebt === 'low') financialScore -= 5;
        
        if (this.formData.employmentStability === '0-1') financialScore -= 20;
        else if (this.formData.employmentStability === '1-3') financialScore -= 10;
        else if (this.formData.employmentStability === '3-5') financialScore -= 5;
        
        if (this.formData.incomeConsistency === 'very-variable') financialScore -= 25;
        else if (this.formData.incomeConsistency === 'variable') financialScore -= 15;
        else if (this.formData.incomeConsistency === 'stable') financialScore -= 5;
        
        if (this.formData.bankruptcy === 'multiple') financialScore -= 40;
        else if (this.formData.bankruptcy === 'recent') financialScore -= 30;
        else if (this.formData.bankruptcy === 'discharged') financialScore -= 15;
        
        if (this.formData.taxDebt === 'liens') financialScore -= 35;
        else if (this.formData.taxDebt === 'significant') financialScore -= 25;
        else if (this.formData.taxDebt === 'minor') financialScore -= 10;
        
        this.categoryScores.financial_stability = Math.max(0, financialScore);
        
        // Source of Funds Risk (20%)
        let sourceScore = 100;
        if (this.formData.lifestyleConsistency === 'significantly-above') sourceScore -= 40;
        else if (this.formData.lifestyleConsistency === 'slightly-above') sourceScore -= 20;
        
        if (this.formData.cashBusiness === 'primarily-cash') sourceScore -= 35;
        else if (this.formData.cashBusiness === 'significant') sourceScore -= 25;
        else if (this.formData.cashBusiness === 'minor') sourceScore -= 10;
        
        if (this.formData.offshore === 'complex') sourceScore -= 30;
        else if (this.formData.offshore === 'undisclosed') sourceScore -= 25;
        else if (this.formData.offshore === 'disclosed') sourceScore -= 10;
        
        if (this.formData.cryptocurrency === 'unclear-source') sourceScore -= 25;
        else if (this.formData.cryptocurrency === 'significant') sourceScore -= 15;
        else if (this.formData.cryptocurrency === 'minor') sourceScore -= 5;
        
        if (this.formData.giftsReceived === 'unknown-source') sourceScore -= 30;
        else if (this.formData.giftsReceived === 'business') sourceScore -= 15;
        
        // Documentation penalty
        const docCount = (this.formData.documentation || []).length;
        if (docCount === 0) sourceScore -= 25;
        else if (docCount < 3) sourceScore -= 15;
        else if (docCount < 5) sourceScore -= 5;
        
        this.categoryScores.source_of_funds = Math.max(0, sourceScore);
        
        // Reputational Risk (15%)
        let repScore = 100;
        if (this.formData.sanctions === 'sanctions') repScore -= 40;
        else if (this.formData.sanctions === 'significant-media') repScore -= 30;
        else if (this.formData.sanctions === 'minor-media') repScore -= 15;
        
        if (this.formData.questionableAssociates === 'criminal') repScore -= 35;
        else if (this.formData.questionableAssociates === 'significant') repScore -= 25;
        else if (this.formData.questionableAssociates === 'minor') repScore -= 15;
        
        this.categoryScores.reputational = Math.max(0, repScore);
        
        // Transparency Risk (10%)
        let transScore = 100;
        if (this.formData.informationSharing === 'secretive') transScore -= 50;
        else if (this.formData.informationSharing === 'reluctant') transScore -= 30;
        else if (this.formData.informationSharing === 'somewhat-open') transScore -= 15;
        
        if (this.formData.inconsistentStories === 'major') transScore -= 40;
        else if (this.formData.inconsistentStories === 'significant') transScore -= 25;
        else if (this.formData.inconsistentStories === 'minor') transScore -= 10;
        
        this.categoryScores.transparency = Math.max(0, transScore);
        
        // Family/External Risk (5%)
        let familyScore = 100;
        if (this.formData.pepStatus === 'direct') familyScore -= 40;
        else if (this.formData.pepStatus === 'associate') familyScore -= 25;
        else if (this.formData.pepStatus === 'family') familyScore -= 15;
        
        if (this.formData.inheritance === 'disputed') familyScore -= 30;
        
        this.categoryScores.family_external = Math.max(0, familyScore);
        
        // Personal Safety Risk (3%)
        let safetyScore = 100;
        if (this.formData.financialControl === 'complete') safetyScore -= 60;
        else if (this.formData.financialControl === 'significant') safetyScore -= 40;
        else if (this.formData.financialControl === 'minor') safetyScore -= 20;
        
        if (this.formData.pressureDecisions === 'extreme') safetyScore -= 50;
        else if (this.formData.pressureDecisions === 'significant') safetyScore -= 30;
        else if (this.formData.pressureDecisions === 'mild') safetyScore -= 15;
        
        this.categoryScores.personal_safety = Math.max(0, safetyScore);
        
        // Future Exposure Risk (2%)
        let futureScore = 100;
        if (this.formData.frequentMoves === 'suspicious') futureScore -= 40;
        else if (this.formData.frequentMoves === 'frequent') futureScore -= 25;
        else if (this.formData.frequentMoves === 'occasional') futureScore -= 10;
        
        this.categoryScores.future_exposure = Math.max(0, futureScore);
    }
    
    calculateOverallScore() {
        let weightedScore = 0;
        
        for (const [category, data] of Object.entries(this.riskCategories)) {
            const categoryScore = this.categoryScores[category] || 0;
            weightedScore += categoryScore * data.weight;
        }
        
        this.riskScore = Math.round(weightedScore);
    }
    
    showResults() {
        this.showPage('resultsPage');
        this.displayScore();
        this.createCharts();
        this.generateRecommendations();
    }
    
    displayScore() {
        const scoreElement = document.getElementById('scoreValue');
        const levelElement = document.getElementById('riskLabel');
        const circleElement = document.getElementById('scoreCircle');
        
        scoreElement.textContent = this.riskScore;
        
        let level, levelClass, color;
        if (this.riskScore >= 80) {
            level = 'Low Risk - Proceed';
            levelClass = 'risk-low';
            color = '#10B981';
        } else if (this.riskScore >= 50) {
            level = 'Medium Risk - Proceed with Safeguards';
            levelClass = 'risk-medium';
            color = '#F59E0B';
        } else {
            level = 'High Risk - Do Not Proceed';
            levelClass = 'risk-high';
            color = '#EF4444';
        }
        
        levelElement.textContent = level;
        levelElement.className = `risk-label ${levelClass}`;
        
        // Update score circle
        const percentage = this.riskScore;
        const degrees = (percentage / 100) * 360;
        circleElement.style.background = `conic-gradient(
            ${color} 0deg,
            ${color} ${degrees}deg,
            var(--color-secondary) ${degrees}deg,
            var(--color-secondary) 360deg
        )`;
    }
    
    createCharts() {
        this.createCategoryChart();
        this.createRiskChart();
    }
    
    createCategoryChart() {
        const ctx = document.getElementById('categoryChart').getContext('2d');
        
        const labels = Object.values(this.riskCategories).map(cat => cat.name);
        const scores = Object.keys(this.riskCategories).map(key => this.categoryScores[key] || 0);
        const weights = Object.values(this.riskCategories).map(cat => cat.weight * 100);
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Risk Score',
                        data: scores,
                        backgroundColor: '#1FB8CD',
                        borderColor: '#1FB8CD',
                        borderWidth: 1
                    },
                    {
                        label: 'Weight (%)',
                        data: weights,
                        backgroundColor: '#FFC185',
                        borderColor: '#FFC185',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        });
    }
    
    createRiskChart() {
        const ctx = document.getElementById('riskChart').getContext('2d');
        
        const riskLevels = ['Low Risk (80-100)', 'Medium Risk (50-79)', 'High Risk (0-49)'];
        const currentRisk = this.riskScore >= 80 ? 0 : this.riskScore >= 50 ? 1 : 2;
        const data = [0, 0, 0];
        data[currentRisk] = 1;
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: riskLevels,
                datasets: [{
                    data: [
                        this.riskScore >= 80 ? 1 : 0,
                        this.riskScore >= 50 && this.riskScore < 80 ? 1 : 0,
                        this.riskScore < 50 ? 1 : 0
                    ],
                    backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
                    borderColor: ['#10B981', '#F59E0B', '#EF4444'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    generateRecommendations() {
        const recommendationsEl = document.getElementById('recommendationContent');
        let content = '';
        
        if (this.riskScore >= 80) {
            content = this.getLowRiskRecommendations();
        } else if (this.riskScore >= 50) {
            content = this.getMediumRiskRecommendations();
        } else {
            content = this.getHighRiskRecommendations();
        }
        
        recommendationsEl.innerHTML = content;
    }
    
    getLowRiskRecommendations() {
        return `
            <div class="recommendation-section">
                <h4>Assessment Summary</h4>
                <p>The assessment indicates low financial risk. Your partner demonstrates good financial transparency and stability with minimal red flags detected.</p>
            </div>
            <div class="recommendation-section">
                <h4>Minimal Safeguards Suggested</h4>
                <ul class="recommendation-list">
                    <li>Consider basic financial disclosure agreements</li>
                    <li>Maintain awareness of significant financial changes</li>
                    <li>Regular financial check-ins and open communication</li>
                    <li>Basic asset protection planning for the future</li>
                </ul>
            </div>
            <div class="recommendation-section">
                <h4>Positive Indicators</h4>
                <ul class="recommendation-list">
                    <li>Strong financial transparency and documentation</li>
                    <li>Consistent income and lifestyle alignment</li>
                    <li>Good legal and tax compliance record</li>
                    <li>Open communication about financial matters</li>
                </ul>
            </div>
        `;
    }
    
    getMediumRiskRecommendations() {
        return `
            <div class="recommendation-section">
                <h4>Assessment Summary</h4>
                <p>The assessment indicates moderate financial risk. While there are no critical red flags, several areas require attention and protective measures.</p>
            </div>
            <div class="recommendation-section">
                <h4>Recommended Safeguards</h4>
                <ul class="recommendation-list">
                    <li>Comprehensive prenuptial agreement with financial disclosure requirements</li>
                    <li>Separate bank accounts and asset structures</li>
                    <li>Regular financial audits and monitoring arrangements</li>
                    <li>Professional verification of income sources and documentation</li>
                    <li>Time-bound disclosure milestones for major financial decisions</li>
                    <li>Credit monitoring and identity protection services</li>
                </ul>
            </div>
            <div class="recommendation-section">
                <h4>Areas of Concern</h4>
                <ul class="recommendation-list">
                    ${this.getSpecificConcerns()}
                </ul>
            </div>
        `;
    }
    
    getHighRiskRecommendations() {
        return `
            <div class="recommendation-section">
                <h4>Assessment Summary</h4>
                <p><strong>WARNING:</strong> The assessment indicates high financial risk with significant concerns identified. Proceeding with this relationship could expose you to serious legal, financial, and personal risks.</p>
            </div>
            <div class="recommendation-section">
                <h4>Critical Red Flags</h4>
                <ul class="recommendation-list">
                    ${this.getCriticalFlags()}
                </ul>
            </div>
            <div class="recommendation-section">
                <h4>Recommended Actions</h4>
                <ul class="recommendation-list">
                    <li><strong>Do not proceed</strong> with financial commitments or marriage</li>
                    <li>Seek immediate consultation with legal and financial professionals</li>
                    <li>Consider professional background investigation services</li>
                    <li>Maintain complete financial independence and separation</li>
                    <li>Document all interactions and financial discussions</li>
                    <li>Consider personal safety planning if control behaviors are present</li>
                </ul>
            </div>
        `;
    }
    
    getSpecificConcerns() {
        const concerns = [];
        
        if (this.categoryScores.legal_compliance < 70) {
            concerns.push('Legal or tax compliance issues requiring verification');
        }
        if (this.categoryScores.financial_stability < 70) {
            concerns.push('Financial instability or significant debt concerns');
        }
        if (this.categoryScores.source_of_funds < 70) {
            concerns.push('Unclear or inadequately documented wealth sources');
        }
        if (this.categoryScores.transparency < 70) {
            concerns.push('Limited financial transparency or inconsistent information');
        }
        
        return concerns.map(concern => `<li>${concern}</li>`).join('');
    }
    
    getCriticalFlags() {
        const flags = [];
        
        if (this.formData.criminalHistory && this.formData.criminalHistory !== 'none') {
            flags.push('Criminal history related to financial crimes');
        }
        if (this.formData.financialControl === 'complete' || this.formData.financialControl === 'significant') {
            flags.push('Signs of financial control or abuse');
        }
        if (this.formData.informationSharing === 'secretive') {
            flags.push('Extreme financial secrecy and resistance to disclosure');
        }
        if (this.formData.lifestyleConsistency === 'significantly-above') {
            flags.push('Lifestyle significantly exceeds documented income');
        }
        if (this.formData.sanctions === 'sanctions') {
            flags.push('Sanctions exposure or significant adverse media coverage');
        }
        
        return flags.map(flag => `<li>${flag}</li>`).join('');
    }
    
    resetAssessment() {
        this.currentStep = 1;
        this.formData = {};
        this.riskScore = 0;
        this.categoryScores = {};
        
        // Clear form data
        document.querySelectorAll('#assessmentPage input, #assessmentPage select').forEach(element => {
            if (element.type === 'checkbox') {
                element.checked = false;
            } else {
                element.value = '';
            }
        });
        
        this.showPage('welcomePage');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RiskAssessmentApp();
});