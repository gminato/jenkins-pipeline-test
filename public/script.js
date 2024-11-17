console.log('java script is working');

const getDogs = async () => {
        const res = await fetch('/api/dogs/1731258698260');
        let data = await res.json();
        if(res.status === 404) {
            data = {
                id: 1731258698260,
                name: '',
                breed: '',
                age: 0 
            }
        }
        console.log("got data");
        const form = document.querySelector('#dog-info');
        form.name.value = data.name;
        form.breed.value = data.breed;
        form.age.value = data.age;

        return data;
};

const init = async () => {
    const dogObj = await getDogs();

    // handle form submission
    const form = document.querySelector('#dog-info');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        console.log(dogObj);

        dogObj.name = data.name;
        dogObj.breed = data.breed;
        dogObj.age = data.age;
        
        console.log("dogObj");
        console.log(dogObj);

        const res = await fetch('/dogs/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dogObj)
        });
        console.log(res);
    });
};

init();

