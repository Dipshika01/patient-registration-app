import { getDatabase } from './pgInstance';

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
    if (this.initialized) return;

    try {
      this.db = await getDatabase();

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

      this.initialized = true;
    } catch (err) {
      console.error("Error initializing database:", err);
      throw err;
    }
  }
  

  async getPatients() {
    if (!this.initialized) await this.initialize();
    const result = await this.db.query("SELECT * FROM patients ORDER BY created_at DESC");
    return result.rows;
  }

  async registerPatient(patientData) {
    if (!this.initialized) await this.initialize();
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
    if (!this.initialized) await this.initialize();
    const result = await this.db.query(query);
    return result.rows;
  }
}

const databaseService = new DatabaseService();
export default databaseService;
