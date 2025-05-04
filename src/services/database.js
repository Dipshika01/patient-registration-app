import { PGlite } from "https://cdn.jsdelivr.net/npm/@electric-sql/pglite/dist/index.js";

class DatabaseService {
  constructor() {
    if (!DatabaseService.instance) {
      this.db = null;
      this.initialized = false;
      DatabaseService.instance = this;
    }
    return DatabaseService.instance;
  }

  async initialize() {
    if (!this.initialized) {
      console.log('Initializing database service...');
      this.db = new PGlite();
      
      // Create the patients table
      await this.db.query(`
        CREATE TABLE IF NOT EXISTS patients (
          id SERIAL PRIMARY KEY,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          date_of_birth TEXT NOT NULL,
          gender TEXT NOT NULL,
          address TEXT,
          phone TEXT,
          email TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Test the connection
      const test = await this.db.query("SELECT COUNT(*) FROM patients");
      console.log('Database initialized with', test.rows[0].count, 'patients');
      
      this.initialized = true;
    }
  }

  async getPatients() {
    if (!this.initialized) {
      await this.initialize();
    }
    const result = await this.db.query('SELECT * FROM patients ORDER BY created_at DESC');
    console.log('Fetched patients:', result.rows);
    return result.rows;
  }

  async registerPatient(patientData) {
    if (!this.initialized) {
      await this.initialize();
    }
    await this.db.query(
      `INSERT INTO patients (first_name, last_name, date_of_birth, gender, address, phone, email)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        patientData.firstName,
        patientData.lastName,
        patientData.dateOfBirth,
        patientData.gender,
        patientData.address,
        patientData.phone,
        patientData.email,
      ]
    );
    return this.getPatients();
  }

  async executeQuery(query) {
    if (!this.initialized) {
      await this.initialize();
    }
    const result = await this.db.query(query);
    return result.rows;
  }
}

const databaseService = new DatabaseService();
export default databaseService; 