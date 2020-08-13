var sqlite3 = require('sqlite3').verbose();//sqlite3 npm

var Table = require('cli-table');// cli-table

const readline = require('readline');// Readline
const { maxHeaderSize } = require('http');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'silahkan pilih opsi di bawah ini '
});

class Home {

    constructor() {
        this.option = ['Mahasiswa', 'Jurusan', 'Dosen', 'Matakuliah', 'Kontrak', 'Keluar'];
        this.subOption = ['Mahasiswa', 'Jurusan', 'Dosen', 'Matakuliah', 'Kontrak',];
        this.list = ['daftar', 'cari', 'tambah', 'hapus'];
    }

    opsi() {
        console.log('==========================================================');
        console.log('silahkan pilih opsi di bawah ini');// opsi this.option

        for (let i = 0; i < this.option.length; i++) {
            console.log(`[${i + 1}] ${this.option[i]}`);
        }

        console.log('===========================================================');
    }

    subOpsi(index) {
        console.log('==========================================================');
        console.log('silahkan pilih opsi di bawah ini');// opsi this.suboption

        for (let i = 0; i < 4; i++) {
            console.log(`[${i + 1}] ${this.list[i]} ${this.subOption[index]}`);
        }
        console.log('[5] kembali');
        console.log('===========================================================');
    }
}

class Mahasiswa {

    constructor() {
        this.db = new sqlite3.Database('./university.db', sqlite3.OPEN_READWRITE);//sqlite3.OPEN_READWRITE: buka database untuk membaca dan menulis.
    }

    list() {
        this.db.serialize(() => { //Ini berarti bahwa hanya satu pernyataan yang dapat dieksekusi pada suatu waktu. Pernyataan lain akan menunggu dalam antrian sampai semua pernyataan sebelumnya dijalankan.
            let sql = "SELECT * FROM Mahasiswa";
            this.db.all(sql, (err, rows) => {//memanggil callback dengan semua baris hasil sesudahnya
                if (err) {
                    throw err;
                } else {//cetak isi row
                    var table = new Table({ //Membuat cli-table Horizontal Tables
                        head: ['NIM', 'Nama', 'Alamat', 'Jurusan']
                        , colWidths: [15, 40, 60, 10]
                    });
                    rows.forEach((row) => {//row value; daftar yang diurutkan dari dua atau lebih nilai skalar.
                        table.push([row.nim, row.nama_mahasiswa, row.alamat, row.id_jr])
                    });
                    console.log(table.toString());
                    hm.subOpsi(0);
                    rl.prompt();
                }
            });
        });

    }

    search() {
        rl.question('Masukan NIM Mahasiswa yang anda cari, NIM :', (nim) => {//rl.question()nodejs
            let sql = "SELECT * FROM Mahasiswa WHERE nim = ?";
            this.db.get(sql, [nim], (err, row) => {//memanggil callback dengan baris hasil pertama setelahnya
                if (err) {
                    throw err;
                } if (row) {
                    console.log(`NIM     :${row.nim}`);
                    console.log(`Nama    :${row.nama_mahasiswa}`);
                    console.log(`Alamat  :${row.alamat}`);
                    console.log(`Jurusan :${row.id_jr}`);
                } else {
                    console.log(`Mahasiswa dengan NIM ${nim} tidak terdaftar`);
                }
                hm.subOpsi(0);
                rl.prompt();
            });
        });
    }

    add() {
        console.log('Lengkapi data di bawah ini: ');
        rl.question('NIM :', (nim) => {
            rl.question('Nama :', (nama_mahasiswa) => {
                rl.question('Alamat :', (alamat) => {
                    rl.question('Jenis Kelamin :', (jenis_kelamin) => {
                        rl.question('Umur :', (umur) => {
                            rl.question('Jurusan :', (id_jr) => {
                                this.db.serialize(() => {
                                    let sql = `INSERT INTO Mahasiswa (nim, nama_mahasiswa, alamat, jenis_kelamin, umur, id_jr) VALUES ("${nim}", "${nama_mahasiswa}", "${alamat}", "${jenis_kelamin}", ${umur}, "${id_jr}")`;
                                    this.db.run(sql, (err) => { //eksekusi pernyataan
                                        if (err) {
                                            throw err;
                                        }
                                        mh.list();
                                        hm.subOpsi(0);
                                        rl.prompt();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
        return this;
    }

    delete() {
        rl.prompt();
        rl.question('masukan NIM mahasiswa yang akan dihapus: ', (nim) => {
            this.db.run(`DELETE FROM Mahasiswa WHERE nim = '${nim}'`, (err) => {
                if (err) {
                    return console.error(err.message);//Jika Call Back err menampilkan Pesan Error
                }
                console.log(`Mahasiswa dengan NIM ${nim} telah dihapus`);
                mh.list();
                hm.subOpsi(0);
                rl.prompt();
            });
        })
    }
}

class Jurusan {

    constructor() {
        this.db = new sqlite3.Database('./university.db', sqlite3.OPEN_READWRITE);//sqlite3.OPEN_READWRITE: buka database untuk membaca dan menulis.
    }

    list() {
        this.db.serialize(() => { //Ini berarti bahwa hanya satu pernyataan yang dapat dieksekusi pada suatu waktu. Pernyataan lain akan menunggu dalam antrian sampai semua pernyataan sebelumnya dijalankan.
            let sql = "SELECT * FROM Jurusan";
            this.db.all(sql, (err, rows) => {//memanggil callback dengan semua baris hasil sesudahnya
                if (err) {
                    throw err;
                } else {//cetak isi row
                    var table = new Table({ //Membuat cli-table Horizontal Tables
                        head: ['Kode Jurusan', 'Nama Jurusan']
                        , colWidths: [15, 25]
                    });
                    rows.forEach((row) => {//row value; daftar yang diurutkan dari dua atau lebih nilai skalar.
                        table.push([row.id_jr, row.nama_jurusan])
                    });
                    console.log(table.toString());
                    hm.subOpsi(1);
                    rl.prompt();
                }
            });
        });

    }

    search() {
        rl.question('Masukan Kode Jurusan yang anda cari, Kode Jurusan :', (id_jr) => {//rl.question()nodejs
            let sql = "SELECT * FROM Jurusan WHERE id_jr = ?";
            this.db.get(sql, [id_jr], (err, row) => {//memanggil callback dengan baris hasil pertama setelahnya
                if (err) {
                    throw err;
                } if (row) {
                    console.log(`Kode Jurusan    :${row.id_jr}`);
                    console.log(`Nama Jurusan    :${row.nama_jurusan}`);
                } else {
                    console.log(`Nama Jurusan dengan Kode Jurusan ${id_jr} tidak terdaftar`);
                }
                hm.subOpsi(1);
                rl.prompt();
            });
        });
    }

    add() {
        console.log('Lengkapi data di bawah ini: ');
        rl.question('Kode Jurusan :', (id_jr) => {
            rl.question('Nama Jurusan :', (nama_jurusan) => {
                this.db.serialize(() => {
                    let sql = `INSERT INTO Jurusan (id_jr, nama_jurusan) VALUES ("${id_jr}", "${nama_jurusan}")`;
                    this.db.run(sql, (err) => { //eksekusi pernyataan
                        if (err) {
                            throw err;
                        }
                        jr.list();
                        hm.subOpsi(1);
                        rl.prompt();
                    });
                });
            });
        });
        return this;
    }

    delete() {
        rl.prompt();
        rl.question('masukan Kode Jurusan yang akan dihapus: ', (id_jr) => {
            this.db.run(`DELETE FROM Jurusan WHERE id_jr = '${id_jr}'`, (err) => {
                if (err) {
                    return console.error(err.message);//Jika Call Back err menampilkan Pesan Error
                }
                console.log(`Nama Jurusan dengan Kode Jurusan ${id_jr} telah dihapus`);
                jr.list();
                hm.subOpsi(1);
                rl.prompt();
            });
        })
    }
}

class Dosen {

    constructor() {
        this.db = new sqlite3.Database('./university.db', sqlite3.OPEN_READWRITE);//sqlite3.OPEN_READWRITE: buka database untuk membaca dan menulis.
    }

    list() {
        this.db.serialize(() => { //Ini berarti bahwa hanya satu pernyataan yang dapat dieksekusi pada suatu waktu. Pernyataan lain akan menunggu dalam antrian sampai semua pernyataan sebelumnya dijalankan.
            let sql = "SELECT * FROM Dosen";
            this.db.all(sql, (err, rows) => {//memanggil callback dengan semua baris hasil sesudahnya
                if (err) {
                    throw err;
                } else {//cetak isi row
                    var table = new Table({ //Membuat cli-table Horizontal Tables
                        head: ['Kode Dosen', 'Nama Dosen']
                        , colWidths: [15, 25]
                    });
                    rows.forEach((row) => {//row value; daftar yang diurutkan dari dua atau lebih nilai skalar.
                        table.push([row.id_dos, row.nama_dosen])
                    });
                    console.log(table.toString());
                    hm.subOpsi(2);
                    rl.prompt();
                }
            });
        });

    }

    search() {
        rl.question('Masukan Kode Dosen yang anda cari, Kode Dosen :', (id_dos) => {//rl.question()nodejs
            let sql = "SELECT * FROM Dosen WHERE id_dos = ?";
            this.db.get(sql, [id_dos], (err, row) => {//memanggil callback dengan baris hasil pertama setelahnya
                if (err) {
                    throw err;
                } if (row) {
                    console.log(`Kode Dosen    :${row.id_dos}`);
                    console.log(`Nama Dosen    :${row.nama_dosen}`);
                } else {
                    console.log(`Nama Dosen dengan Kode Dosen ${id_dos} tidak terdaftar`);
                }
                hm.subOpsi(2);
                rl.prompt();
            });
        });
    }

    add() {
        console.log('Lengkapi data di bawah ini: ');
        rl.question('Kode Dosen :', (id_dos) => {
            rl.question('Nama Dosen :', (nama_dosen) => {
                this.db.serialize(() => {
                    let sql = `INSERT INTO Dosen (id_dos, nama_dosen) VALUES ("${id_dos}", "${nama_dosen}")`;
                    this.db.run(sql, (err) => { //eksekusi pernyataan
                        if (err) {
                            throw err;
                        }
                        ds.list();
                        hm.subOpsi(2);
                        rl.prompt();
                    });
                });
            });
        });
        return this;
    }

    delete() {
        rl.prompt();
        rl.question('masukan Kode Dosen yang akan dihapus: ', (id_dos) => {
            this.db.run(`DELETE FROM Dosen WHERE id_dos = '${id_dos}'`, (err) => {
                if (err) {
                    return console.error(err.message);//Jika Call Back err menampilkan Pesan Error
                }
                console.log(`Dosen dengan Kode Dosen ${id_dos} telah dihapus`);
                ds.list();
                hm.subOpsi(2);
                rl.prompt();
            });
        })
    }
}

class Matakuliah {

    constructor() {
        this.db = new sqlite3.Database('./university.db', sqlite3.OPEN_READWRITE);//sqlite3.OPEN_READWRITE: buka database untuk membaca dan menulis.
    }

    list() {
        this.db.serialize(() => { //Ini berarti bahwa hanya satu pernyataan yang dapat dieksekusi pada suatu waktu. Pernyataan lain akan menunggu dalam antrian sampai semua pernyataan sebelumnya dijalankan.
            let sql = "SELECT * FROM Matakuliah";
            this.db.all(sql, (err, rows) => {//memanggil callback dengan semua baris hasil sesudahnya
                if (err) {
                    throw err;
                } else {//cetak isi row
                    var table = new Table({ //Membuat cli-table Horizontal Tables
                        head: ['Kode Mata Kuliah', 'Nama Mata Kuliah', 'Jumlah SKS']
                        , colWidths: [25, 25, 20]
                    });
                    rows.forEach((row) => {//row value; daftar yang diurutkan dari dua atau lebih nilai skalar.
                        table.push([row.id_mk, row.nama_matakuliah, row.jumlah_sks])
                    });
                    console.log(table.toString());
                    hm.subOpsi(3);
                    rl.prompt();
                }
            });
        });

    }

    search() {
        rl.question('Masukan Kode Mata Kuliah yang anda cari, Kode Mata Kuliah :', (id_mk) => {//rl.question()nodejs
            let sql = "SELECT * FROM Matakuliah WHERE id_mk = ?";
            this.db.get(sql, [id_mk], (err, row) => {//memanggil callback dengan baris hasil pertama setelahnya
                if (err) {
                    throw err;
                } if (row) {
                    console.log(`Kode Mata Kuliah    :${row.id_mk}`);
                    console.log(`Nama Mata Kuliah    :${row.nama_matakuliah}`);
                    console.log(`Jumlah SKS          :${row.jumlah_sks}`);

                } else {
                    console.log(`Nama Mata Kuliah dengan Kode Mata Kuliah ${id_mk} tidak terdaftar`);
                }
                hm.subOpsi(3);
                rl.prompt();
            });
        });
    }

    add() {
        console.log('Lengkapi data di bawah ini: ');
        rl.question('Kode Mata Kuliah :', (id_mk) => {
            rl.question('Nama Mata Kuliah :', (nama_matakuliah) => {
                rl.question('Jumlah SKS :', (jumlah_sks) => {
                    this.db.serialize(() => {
                        let sql = `INSERT INTO Matakuliah (id_mk, nama_matakuliah, jumlah_sks) VALUES ("${id_mk}", "${nama_matakuliah}", ${jumlah_sks})`;
                        this.db.run(sql, (err) => { //eksekusi pernyataan
                            if (err) {
                                throw err;
                            }
                            mk.list();
                            hm.subOpsi(3);
                            rl.prompt();
                        });
                    });
                });
            });
        });
        return this;
    }

    delete() {
        rl.prompt();
        rl.question('masukan Kode Mata Kuliah yang akan dihapus: ', (id_mk) => {
            this.db.run(`DELETE FROM Matakuliah WHERE id_mk = '${id_mk}'`, (err) => {
                if (err) {
                    return console.error(err.message);//Jika Call Back err menampilkan Pesan Error
                }
                console.log(`Mata Kuliah dengan Kode Mata Kuliah ${id_mk} telah dihapus`);
                mk.list();
                hm.subOpsi(3);
                rl.prompt();
            });
        })
    }
}

class KontrakKuliah {

    constructor() {
        this.db = new sqlite3.Database('./university.db', sqlite3.OPEN_READWRITE);//sqlite3.OPEN_READWRITE: buka database untuk membaca dan menulis.
    }

    list() {
        this.db.serialize(() => { //Ini berarti bahwa hanya satu pernyataan yang dapat dieksekusi pada suatu waktu. Pernyataan lain akan menunggu dalam antrian sampai semua pernyataan sebelumnya dijalankan.
            let sql = "SELECT * FROM KontrakKuliah";
            this.db.all(sql, (err, rows) => {//memanggil callback dengan semua baris hasil sesudahnya
                if (err) {
                    throw err;
                } else {//cetak isi row
                    var table = new Table({ //Membuat cli-table Horizontal Tables
                        head: ['Kode Kontrak Kuliah', 'NIM', 'Kode Mata Kuliah', 'Kode Dosen', 'Nilai']
                        , colWidths: [30, 15, 25, 20, 15]
                    });
                    rows.forEach((row) => {//row value; daftar yang diurutkan dari dua atau lebih nilai skalar.
                        table.push([row.id_kontrak, row.nim, row.id_mk, row.id_dos, row.nilai])
                    });
                    console.log(table.toString());
                    hm.subOpsi(4);
                    rl.prompt();
                }
            });
        });
    }

    search() {
        rl.question('Masukan Kode Kontrak Kuliah yang anda cari, Kode Kontrak Kuliah :', (id_kontrak) => {//rl.question()nodejs
            let sql = "SELECT * FROM KontrakKuliah WHERE id_kontrak = ?";
            this.db.get(sql, [id_kontrak], (err, row) => {//memanggil callback dengan baris hasil pertama setelahnya
                if (err) {
                    throw err;
                } if (row) {
                    console.log(`Kode Kontrak Kuliah  :${row.id_kontrak}`);
                    console.log(`NIM                  :${row.nim}`);
                    console.log(`Kode Mata Kuliah     :${row.id_mk}`);
                    console.log(`Kode Dosen           :${row.id_dos}`);
                    console.log(`Nilai                :${row.nilai}`);
                } else {
                    console.log(`Kode Kontrak Kuliah ${id_kontrak} tidak terdaftar`);
                }
                hm.subOpsi(4);
                rl.prompt();
            });
        });
    }

    add() {
        console.log('Lengkapi data di bawah ini: ');
        rl.question('Kode Kontrak Kuliah :', (id_kontrak) => {
            rl.question('NIM :', (nim) => {
                rl.question('Kode Mata Kuliah :', (id_mk) => {
                    rl.question('Kode Dosen :', (id_dos) => {
                        rl.question('Nilai :', (nilai) => {
                            this.db.serialize(() => {
                                let sql = `INSERT INTO KontrakKuliah (id_kontrak, nim, id_mk, id_dos, nilai) VALUES ("${id_kontrak}", "${nim}", "${id_mk}", "${id_dos}", "${nilai}")`;
                                this.db.run(sql, (err) => { //eksekusi pernyataan
                                    if (err) {
                                        throw err;
                                    }
                                    kk.list();
                                    hm.subOpsi(4);
                                    rl.prompt();
                                });
                            });
                        });
                    });
                });
            });
        });
        return this;
    }

    delete() {
        rl.prompt();
        rl.question('masukan Kode Kontrak Kuliah yang akan dihapus: ', (id_kontrak) => {
            this.db.run(`DELETE FROM KontrakKuliah WHERE id_kontrak = '${id_kontrak}'`, (err) => {
                if (err) {
                    return console.error(err.message);//Jika Call Back err menampilkan Pesan Error
                }
                console.log(`Kode Kontrak Kuliah ${id_kontrak} telah dihapus`);
                kk.list();
                hm.subOpsi(4);
                rl.prompt();
            });
        })
    }
}

function login() {
    console.log(`
    =========================================================================
                   Welcome to Universitas Pendidikan Indonesia
                            Jalan Setiabudhi No.255
    =========================================================================`);
    rl.question('Username : ', (user) => {
        console.log('=========================================================================');
        rl.question('Password :', (password) => {
            console.log('=========================================================================');
            mh.db.serialize(() => {
                let sql = 'SELECT * FROM Login WHERE user = ? AND password = ?';
                mh.db.get(sql, [user, password], (err, row) => {
                    if (err) throw err;
                    if (row) {
                        console.log(`Welcome, ${user}. Your acces level is: ${row.acces}`);
                        console.log('=========================================================================');
                        run();
                    } else {
                        console.log('Username belum terdaftar!');
                        login();
                    }
                });
            });
        });
    });
}

let hm = new Home();

let mh = new Mahasiswa();
let jr = new Jurusan();
let ds = new Dosen();
let mk = new Matakuliah();
let kk = new KontrakKuliah();

function run() {
    hm.opsi();
    rl.question('masukan salah satu no. dari opsi diatas : ', (num) => {
        switch (num) {

            case '1'://Mahasiswa
                hm.subOpsi(0);
                rl.prompt();
                rl.on('line', (number) => {
                    console.log(number);

                    switch (number) {
                        case '1':
                            mh.list();
                            break;
                        case '2':
                            mh.search();
                            break;
                        case '3':
                            mh.add();
                            break;
                        case '4':
                            mh.delete();
                            break;
                        case '5':
                            hm.opsi();
                            run();
                            break;
                        default:
                            console.log('pilihan yang anda masukan salah');
                            hm.subOpsi();
                            break;
                    }
                });
                break;

            case '2'://Jurusan
                hm.subOpsi(1);
                rl.prompt();
                rl.on('line', (number) => {
                    console.log(number);

                    switch (number) {
                        case '1':
                            jr.list();
                            break;
                        case '2':
                            jr.search();
                            break;
                        case '3':
                            jr.add();
                            break;
                        case '4':
                            jr.delete();
                            break;
                        case '5':
                            hm.opsi();
                            run();
                            break;
                        default:
                            console.log('pilihan yang anda masukan salah');
                            hm.subOpsi(1);
                            break;
                    }
                });
                break;

            case '3'://Dosen
                hm.subOpsi(2);
                rl.prompt();
                rl.on('line', (number) => {
                    console.log(number);

                    switch (number) {
                        case '1':
                            ds.list();
                            break;
                        case '2':
                            ds.search();
                            break;
                        case '3':
                            ds.add();
                            break;
                        case '4':
                            ds.delete();
                            break;
                        case '5':
                            hm.opsi();
                            run();
                            break;
                        default:
                            console.log('pilihan yang anda masukan salah');
                            hm.subOpsi(2);
                            break;
                    }
                });
                break;

            case '4'://Mata Kuliah
                hm.subOpsi(3);
                rl.prompt();
                rl.on('line', (number) => {
                    console.log(number);

                    switch (number) {
                        case '1':
                            mk.list();
                            break;
                        case '2':
                            mk.search();
                            break;
                        case '3':
                            mk.add();
                            break;
                        case '4':
                            mk.delete();
                            break;
                        case '5':
                            hm.opsi();
                            run();
                            break;
                        default:
                            console.log('pilihan yang anda masukan salah');
                            hm.subOpsi(3);
                            break;
                    }
                });
                break;

            case '5'://Kontrak Kuliah
                hm.subOpsi(4);
                rl.prompt();
                rl.on('line', (number) => {
                    console.log(number);

                    switch (number) {
                        case '1':
                            kk.list();
                            break;
                        case '2':
                            kk.search();
                            break;
                        case '3':
                            kk.add();
                            break;
                        case '4':
                            kk.delete();
                            break;
                        case '5':
                            hm.opsi();
                            run();
                            break;
                        default:
                            console.log('pilihan yang anda masukan salah');
                            hm.subOpsi(4);
                            break;
                    }
                });
                break;

            case '6':
                console.log('Anda Telah Logout');
                login();
                break;
            default:
                console.log('pilihan yang anda masukan salah');
                break;
        }
    });
}

login();
