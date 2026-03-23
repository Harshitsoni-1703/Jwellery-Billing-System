
        const API_KEY = "goldapi-3yzvyw8smgx9eh1e-io";

        async function fetchRates() {
            // Gold Fetch
            try {
                const gRes = await fetch("https://www.goldapi.io/api/XAU/INR", { headers: {"x-access-token": API_KEY} });
                const gData = await gRes.json();
                if(gData.price) document.getElementById('gold-val').innerText = "₹ " + Math.round((gData.price/31.1035)*10).toLocaleString();
            } catch(e) { document.getElementById('g-status').innerText = "● Demo Mode"; }

            // Silver Fetch (Alag Try-Catch taaki Gold block na ho)
            try {
                const sRes = await fetch("https://www.goldapi.io/api/XAG/INR", { headers: {"x-access-token": API_KEY} });
                const sData = await sRes.json();
                if(sData.price) document.getElementById('silver-val').innerText = "₹ " + Math.round((sData.price/31.1035)*1000).toLocaleString();
            } catch(e) { document.getElementById('s-status').innerText = "● Demo Mode"; }
        }

        function addItem() {
            const div = document.createElement('div');
            div.className = 'item-row';
            div.innerHTML = `<input type="text" class="i-name" placeholder="Item Name">
                             <input type="number" class="i-weight" placeholder="Weight (g)">
                             <input type="number" class="i-price" oninput="updateTotal()" placeholder="Price (₹)">
                             <button style="background:var(--danger); border:none; color:white; border-radius:5px;" onclick="this.parentElement.remove(); updateTotal();">X</button>`;
            document.getElementById('items-container').appendChild(div);
        }

        function updateTotal() {
            let total = 0;
            document.querySelectorAll('.i-price').forEach(p => total += (parseFloat(p.value) || 0));
            let paid = parseFloat(document.getElementById('paid-amt').value) || 0;
            document.getElementById('sub-total').innerText = "₹ " + total.toLocaleString();
            document.getElementById('baki-amt').innerText = "₹ " + (total - paid).toLocaleString();
            return { total, baki: total - paid };
        }

        function saveBill() {
            const name = document.getElementById('cName').value;
            const res = updateTotal();
            if(!name || res.total <= 0) return alert("Details missing!");

            const items = [];
            document.querySelectorAll('.item-row').forEach(r => {
                const n = r.querySelector('.i-name').value;
                const w = r.querySelector('.i-weight').value;
                if(n) items.push(`${n} (${w}g)`);
            });

            const db = JSON.parse(localStorage.getItem('satyam_final_khata')) || [];
            db.push({ date: document.getElementById('pDate').value, name, mob: document.getElementById('cMob').value, items: items.join(', '), total: res.total, baki: res.baki });
            localStorage.setItem('satyam_final_khata', JSON.stringify(db));
            alert("Bill Saved!");
            location.reload();
        }

        function loadHistory() {
            const db = JSON.parse(localStorage.getItem('satyam_final_khata')) || [];
            document.getElementById('h-body').innerHTML = db.slice().reverse().map(r => `
                <tr>
                    <td>${r.date}</td>
                    <td><b>${r.name}</b><br><small>${r.mob}</small></td>
                    <td><small>${r.items}</small></td>
                    <td>₹${r.total.toLocaleString()}</td>
                    <td style="color:${r.baki > 0 ? 'var(--danger)' : 'var(--success)'}; font-weight:bold;">₹${r.baki.toLocaleString()}</td>
                </tr>
            `).join('');
        }

        function nav(id) {
            document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
            document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
            document.getElementById(id).classList.add('active');
            document.getElementById('n-'+id).classList.add('active');
            if(id === 'history') loadHistory();
        }

        document.getElementById('pDate').valueAsDate = new Date();
        fetchRates();
        setInterval(fetchRates, 60000);
    