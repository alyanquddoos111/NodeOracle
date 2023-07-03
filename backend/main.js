import express from "express";
import oracledb from "oracledb";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
app.use(cors({ origin: 'http://localhost:3001' }));

// Initialize Oracle client
oracledb.initOracleClient({ libDir: 'E:\\instantclient_21_10' });

// Configure Oracle database connection
const dbConfig = {
  user: 'esalyan',
  password: 'P@kistan54',
  connectString: '172.16.178.73:1521/ntlblprm'
};


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create a reusable function to execute queries
async function executeQuery(query, binds = [],) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(query, binds, {autoCommit: true });
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.log(err);
      }
    }
  }
}

// API to insert data into the database
app.post('/insert', async (req, res) => {
    const formData = req.body;
    const insertQuery = 'INSERT INTO testtable(ID, NAME, FATHERNAME, AGE, CONTACTNUMBER, EMAILADDRESS, HOMEADDRESS) VALUES (:id, :myname, :fname, :age, :contact, :email, :address)';

  try {
    await executeQuery(insertQuery, formData);
    res.status(200).send('Insertion successful.');
  } catch (err) {
    res.status(404).send('Error inserting data.');
  }
});

// API to retrieve all rows from the database
app.get('/select', async (req, res) => {
  const selectQuery = 'SELECT * FROM testtable ORDER BY ID';

  try {
    const result = await executeQuery(selectQuery);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send('Error retrieving data.');
  }
});

// API to update data in the database
app.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { name, fname, age, contact, email, address } = req.body;

  const updateQuery = 'UPDATE testtable SET NAME = :name, FATHERNAME = :fname, AGE = :age, CONTACTNUMBER = :contact, EMAILADDRESS = :email, HOMEADDRESS = :address  WHERE id = :id';

  try {
    await executeQuery(updateQuery, { id, name, fname, age, contact, email, address });
    res.status(200).send('Update successful.');
  } catch (err) {
    res.status(500).send('Error updating data.');
  }
});


// API to delete data from the database
app.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  const deleteQuery = 'DELETE FROM testtable WHERE id=:id';

  try {
    await executeQuery(deleteQuery, { id });
    res.status(200).send('Deletion successful.');
  } catch (err) {
    res.status(500).send('Error deleting data.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
