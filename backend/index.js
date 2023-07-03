import oracledb from "oracledb";
oracledb.initOracleClient({libDir: 'E:\\instantclient_21_10'});

async function connect() {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: 'esalyan',
      password: 'P@kistan54',
      connectString: '172.16.178.73:1521/ntlblprm'
    });

    const data = {
      id: 1,
      name: 'Alyan',
      fname: 'Abdul Quddoos',
      email: 'alyanquddoos111@gmail.com',
      age: 21,
      contact: '03144441061',
      address: 'House 745, Street 51'

    };

    

    const insertQuery = 'INSERT INTO testtable(ID, NAME, FATHERNAME, AGE, CONTACTNUMBER, EMAILADDRESS, HOMEADDRESS) VALUES (:id, :name, :fname, :age, :contact, :email, :address)';
    await connection.execute(insertQuery, data );
    await connection.commit();
    console.log('Insertion done.');

    const selectQuery = 'SELECT * FROM testtable';
    const result = await connection.execute(selectQuery);
    console.log(result.rows)

    const updateQuery = "UPDATE testtable SET name='Alyan Quddoos' WHERE id=1";
    await connection.execute(updateQuery);
    await connection.commit();
    const updateResult = await connection.execute(selectQuery);
    console.log(updateResult.rows);

    const deleteQuery = 'DELETE FROM testtable WHERE id=2';
    await connection.execute(deleteQuery);
    await connection.commit();
    const deleteResult = await connection.execute(selectQuery);
    console.log(deleteResult.rows);


    await connection.close();
    console.log('Connection closed.');

  } catch (err) {
    console.log(err);
  }
}

connect();
