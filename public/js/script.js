    // Initialize floating particles
    document.addEventListener('DOMContentLoaded', () => {
      // Create additional floating particles
      for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle rounded-full absolute';
        
        const size = Math.random() * 6 + 2;
        const colors = ['bg-neon-blue', 'bg-neon-purple', 'bg-neon-pink'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const opacity = Math.random() * 0.2 + 0.05;
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const animation = Math.random() > 0.5 ? 'animate-float' : 'animate-float-reverse';
        const duration = Math.random() * 5 + 5;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.classList.add(color);
        particle.style.opacity = opacity;
        particle.style.top = `${top}%`;
        particle.style.left = `${left}%`;
        particle.classList.add(animation);
        particle.style.animationDuration = `${duration}s`;
        
        document.body.appendChild(particle);
      }

      // Character counter
      const textarea = document.getElementById('pesan');
      const charCount = document.getElementById('charCount');
      
      textarea.addEventListener('input', function() {
        const currentLength = this.value.length;
        charCount.textContent = currentLength;
        
        if (currentLength > 900) {
          charCount.classList.add('text-neon-pink');
        } else if (currentLength > 800) {
          charCount.classList.add('text-neon-purple');
          charCount.classList.remove('text-neon-pink');
        } else {
          charCount.classList.remove('text-neon-pink', 'text-neon-purple');
        }
      });
    });

    // Form submission handler
    document.getElementById("requestForm").addEventListener("submit", async function (e) {
      e.preventDefault();
      
      const pesan = document.getElementById("pesan").value.trim();
      
      if (!pesan) {
        showAlert('error', 'Pesan tidak boleh kosong!');
        return;
      }

      const waktu = new Date().toLocaleString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      const submitBtn = document.getElementById("submitBtn");
      const buttonText = document.getElementById("buttonText");
      const buttonIcon = document.getElementById("buttonIcon");
      
      // Hide alerts
      hideAlerts();
      
      // Set loading state
      setLoadingState(true);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Make actual API call
        const response = await fetch("/api/request", {
          method: "POST",
          headers: { 
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ pesan, waktu })
        });
        
        if (response.ok) {
          showAlert('success');
          document.getElementById("requestForm").reset();
          document.getElementById('charCount').textContent = '0';
          
          // Auto-hide success message after 5 seconds
          setTimeout(() => {
            hideAlerts();
          }, 5000);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        showAlert('error', 'Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.');
        
        // Auto-hide error message after 5 seconds
        setTimeout(() => {
          hideAlerts();
        }, 5000);
      } finally {
        setLoadingState(false);
      }
    });

    function setLoadingState(isLoading) {
      const submitBtn = document.getElementById("submitBtn");
      const buttonText = document.getElementById("buttonText");
      const buttonIcon = document.getElementById("buttonIcon");
      
      if (isLoading) {
        submitBtn.disabled = true;
        buttonText.textContent = "Mengirim";
        buttonText.classList.add("loading-dots");
        buttonIcon.className = "fas fa-spinner fa-spin";
      } else {
        submitBtn.disabled = false;
        buttonText.textContent = "Kirim Pesan";
        buttonText.classList.remove("loading-dots");
        buttonIcon.className = "fas fa-paper-plane";
      }
    }

    function showAlert(type, customMessage = null) {
      const alertSuccess = document.getElementById("alertSuccess");
      const alertError = document.getElementById("alertError");
      
      if (type === 'success') {
        alertSuccess.classList.remove('hidden');
        alertSuccess.classList.add('fade-in');
      } else if (type === 'error') {
        if (customMessage) {
          const errorText = alertError.querySelector('p:last-child');
          errorText.textContent = customMessage;
        }
        alertError.classList.remove('hidden');
        alertError.classList.add('fade-in');
      }
    }

    function hideAlerts() {
      const alertSuccess = document.getElementById("alertSuccess");
      const alertError = document.getElementById("alertError");
      
      alertSuccess.classList.add('hidden');
      alertError.classList.add('hidden');
    }
