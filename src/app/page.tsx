import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen section-light flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="glass-card p-12">
          
          {/* Logo/Icon */}
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
              <div className="text-2xl font-bold text-white">B</div>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="mb-12">
            <h1 className="mb-6">
              Bienvenido a Bound
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              ¡Perfecto! Ya tienes acceso completo. Ahora vamos a crear tu agente IA personalizado que entenderá tu negocio y convertirá visitantes en clientes.
            </p>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="text-center p-4">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Setup Rápido</h3>
              <p className="text-sm text-gray-600">Tu agente listo en 2 minutos</p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">IA Inteligente</h3>
              <p className="text-sm text-gray-600">Entiende tu negocio único</p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-purple-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Más Leads</h3>
              <p className="text-sm text-gray-600">Convierte 24/7 automáticamente</p>
            </div>
          </div>

          {/* CTA Button */}
          <Link 
            href="/onboarding" 
            className="btn-primary text-lg px-12 py-4 ripple-effect inline-flex items-center justify-center gap-3"
          >
            <span>Crear mi Agente IA</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          {/* Additional Info */}
          <p className="mt-8 text-sm text-gray-500">
            El proceso es súper simple. Solo necesitas contarnos sobre tu negocio y nosotros creamos el agente perfecto para ti.
          </p>
        </div>
      </div>
    </div>
  )
}